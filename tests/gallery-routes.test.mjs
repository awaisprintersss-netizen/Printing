import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { after, beforeEach, mock, test } from 'node:test';
import { MongoClient, ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});

let user;
let authError;
let connectionError;
let collection;
let uploadError;
const events = [];
const testEnv = {
  DATABASE_URL: 'mongodb://127.0.0.1:1',
  DATABASE_NAME: undefined,
  VERCEL: undefined,
  VERCEL_ENV: undefined,
  VERCEL_TARGET_ENV: undefined,
  CLOUDINARY_CLOUD_NAME: 'test-fixture',
  CLOUDINARY_API_KEY: 'test-fixture',
  CLOUDINARY_API_SECRET: 'test-fixture',
};
const savedEnv = Object.fromEntries(Object.keys(testEnv).map(key => [key, process.env[key]]));
const databaseNames = [];
const applyEnv = values => {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
};

mock.module('@clerk/nextjs/server', {
  namedExports: {
    currentUser: async () => {
      if (authError) throw authError;
      return user;
    },
  },
});
mock.method(MongoClient.prototype, 'connect', async function () {
  events.push('connect');
  if (connectionError) throw connectionError;
  return this;
});
mock.method(MongoClient.prototype, 'close', async () => {});
mock.method(MongoClient.prototype, 'db', name => {
  databaseNames.push(name);
  return { collection: () => collection };
});
mock.method(cloudinary.uploader, 'upload', async (image, options) => {
  events.push('upload');
  assert.match(image, /^data:image\/png;base64,/);
  assert.match(options.public_id, /^printing-gallery\/[a-f0-9-]{36}$/);
  assert.equal(options.overwrite, false);
  assert.deepEqual(options.tags, ['awais-gallery-upload']);
  if (uploadError) throw uploadError;
  return { secure_url: 'https://example.test/new.jpg', public_id: options.public_id };
});
mock.method(cloudinary.uploader, 'destroy', async (id) => { events.push(`destroy:${id}`); });
const log = mock.method(console, 'error', () => {});
const review = mock.method(console, 'warn', () => {});

const adminRoutes = await import('../app/api/admin/gallery/route.ts');
const gallery = await import('../app/api/gallery/route.ts');
const seedRoutes = await import('../app/api/store-gallery-data/route.ts');
const uploadRoutes = await import('../app/api/upload/route.ts');
const { galleryImageLimit, galleryImageSizeError, galleryJsonLimit, getGalleryFileError } = await import('../lib/gallery-upload-limits.ts');

beforeEach(() => {
  user = null;
  authError = undefined;
  connectionError = undefined;
  uploadError = undefined;
  collection = undefined;
  events.length = 0;
  databaseNames.length = 0;
  log.mock.resetCalls();
  review.mock.resetCalls();
  globalThis._mongoClientPromise = undefined;
  applyEnv(testEnv);
});

after(() => {
  hooks.deregister();
  mock.restoreAll();
  delete globalThis._mongoClientPromise;
  applyEnv(savedEnv);
});

const privilegedRoutes = [
  [adminRoutes, '/api/admin/gallery', ['GET', 'POST', 'PUT', 'DELETE']],
  [uploadRoutes, '/api/upload', ['POST']],
];

test('all management operations reject signed-out and non-admin sessions before reading data', async () => {
  for (const [routes, path, methods] of privilegedRoutes) {
    for (const method of methods) {
      for (const [current, status] of [[null, 401], [{ publicMetadata: {} }, 403]]) {
        user = current;
        const response = await routes[method](new Request(`https://example.test${path}`, { method }));
        assert.equal(response.status, status, `${method} ${path}`);
      }
    }
  }
  assert.deepEqual(events, []);
});

test('the retired seed endpoint cannot seed or bulk-clear in production or preview', async () => {
  for (const environment of ['production', 'preview']) {
    process.env.VERCEL_ENV = environment;
    for (const current of [null, { publicMetadata: { role: 'admin' } }]) {
      user = current;
      for (const method of ['GET', 'POST', 'DELETE']) {
        const request = new Request('https://example.test/api/store-gallery-data?action=clear', { method });
        const response = await seedRoutes[method](request);
        assert.equal(response.status, 410);
      }
    }
  }
  assert.deepEqual(events, []);
});

test('a Clerk error returns a safe failure without contacting MongoDB or Cloudinary', async () => {
  authError = new Error('private Clerk failure details');
  const response = await adminRoutes.GET(new Request('https://example.test/api/admin/gallery'));
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { success: false, error: 'Request failed. Please try again.' });
  assert.deepEqual(events, []);
  assert.equal(log.mock.callCount(), 1);
});

test('public gallery returns stable string IDs for legacy records and keeps admin metadata private', async () => {
  const fallbackId = new ObjectId();
  collection = {
    find: (filter, options) => {
      assert.deepEqual(filter, {});
      assert.deepEqual(Object.keys(options.projection).sort(), ['_id', 'category', 'client', 'description', 'id', 'image', 'tags', 'title', 'year']);
      return { toArray: async () => [
        { _id: new ObjectId(), id: 0, title: 'Finished print', tags: ['Print', 2], imagePublicId: 'private', customerEmail: 'fixture@example.test', stack: 'diagnostic fixture' },
        { _id: fallbackId, title: 'Legacy photo', year: 2022, image: 'https://fixture-user:fixture-pass@example.test/photo.jpg' },
      ] };
    },
  };
  const response = await gallery.GET();
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.count, 2);
  assert.deepEqual(result.items.map(item => item.id), ['0', fallbackId.toHexString()]);
  assert.deepEqual(result.items.map(item => item.tags), [['Print'], []]);
  assert.equal(result.items[1].year, '2022');
  assert.equal(result.items[1].image, '');
  assert.deepEqual(Object.keys(result.items[0]).sort(), ['category', 'client', 'description', 'id', 'image', 'tags', 'title', 'year']);
  assert.deepEqual(databaseNames, ['printingdata']);
});

test('gallery errors are safe and a subsequent request can reconnect', async () => {
  connectionError = new Error('Mongo failed at mongodb://example-user:example-pass@localhost/shop');
  const failure = await gallery.GET();
  assert.equal(failure.status, 503);
  assert.deepEqual(await failure.json(), {
    success: false, error: 'The gallery is temporarily unavailable.', items: [], count: 0,
  });
  const detail = log.mock.calls[0].arguments[1];
  assert.match(detail, /Mongo failed/);
  assert.doesNotMatch(detail, /example-pass/);
  connectionError = undefined;
  collection = { find: () => ({ toArray: async () => [] }) };
  const recovery = await gallery.GET();
  assert.equal(recovery.status, 200);
  assert.deepEqual(events, ['connect', 'connect']);
});

test('missing MongoDB configuration generates a safe response at request time', async () => {
  delete process.env.DATABASE_URL;
  assert.equal((await gallery.GET()).status, 503);
  assert.deepEqual(events, []);
});

const fields = { title: 'Sample', category: 'labels', description: 'A sample', client: 'Sample client' };
const editId = new ObjectId();
const imageFile = 'data:image/png;base64,YQ==';
function galleryRequest(method, body, headers) {
  return new Request('https://example.test/api/admin/gallery', {
    method, headers,
    body: JSON.stringify({ ...fields, ...body }),
  });
}
function editRequest(body) {
  return galleryRequest('PUT', { _id: editId.toHexString(), ...body });
}
function uploadRequest(file) {
  const body = new FormData();
  body.set('file', file);
  return new Request('https://example.test/api/upload', { method: 'POST', body });
}

test('admin image replacement retains media shared with another gallery record', async () => {
  user = { publicMetadata: { role: 'admin' } };
  const shared = { image: 'https://example.test/shared.jpg', imagePublicId: 'old' };
  const records = [{ _id: editId, ...shared }, { _id: new ObjectId(), ...shared }];
  collection = {
    findOne: async () => records[0],
    updateOne: async (filter, update) => {
      events.push('update');
      assert.equal(filter.updatedAt, null);
      assert.match(update.$set.imagePublicId, /^printing-gallery\//);
      Object.assign(records[0], update.$set);
      return { matchedCount: 1 };
    },
  };
  const response = await adminRoutes.PUT(editRequest({ imageFile, imagePublicId: 'untrusted' }));
  assert.equal(response.status, 200);
  assert.equal(records[1].image, shared.image);
  assert.deepEqual(events, ['connect', 'upload', 'update']);
});

test('admin replacement leaves the existing record and asset intact if the new upload fails', async () => {
  user = { publicMetadata: { role: 'admin' } };
  uploadError = new Error('private upload failure details');
  collection = { findOne: async () => ({ _id: editId, imagePublicId: 'old' }) };
  const response = await adminRoutes.PUT(editRequest({ imageFile }));
  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), { success: false, error: 'Request failed. Please try again.' });
  assert.deepEqual(events, ['connect', 'upload']);
  assert.match(review.mock.calls[0].arguments[1].publicId, /^printing-gallery\//);
  assert.doesNotMatch(log.mock.calls[0].arguments[1], /private upload failure/);
});

test('a conflicting gallery edit flags the unused asset for review and retains both images', async () => {
  user = { publicMetadata: { role: 'admin' } };
  collection = {
    findOne: async () => ({ _id: editId, imagePublicId: 'old' }),
    updateOne: async () => ({ matchedCount: 0 }),
  };
  assert.equal((await adminRoutes.PUT(editRequest({ imageFile }))).status, 409);
  assert.deepEqual(events, ['connect', 'upload']);
  assert.match(review.mock.calls[0].arguments[1].publicId, /^printing-gallery\//);
});

test('deleting one record retains a shared asset and assets with unverified ownership', async () => {
  user = { publicMetadata: { role: 'admin' } };
  const shared = { image: 'https://example.test/shared.jpg', imagePublicId: 'shared' };
  const otherId = new ObjectId();
  const externalId = new ObjectId();
  const records = new Map([
    [editId.toHexString(), { ...shared }],
    [otherId.toHexString(), { image: shared.image }],
    [externalId.toHexString(), { image: 'https://example.org/media.jpg', imagePublicId: 'unknown-ownership' }],
  ]);
  collection = {
    findOneAndDelete: async ({ _id }) => {
      const removed = records.get(_id.toHexString());
      records.delete(_id.toHexString());
      return removed;
    },
  };
  for (const id of [editId, externalId]) {
    const request = new Request(`https://example.test/api/admin/gallery?id=${id.toHexString()}`, { method: 'DELETE' });
    assert.equal((await adminRoutes.DELETE(request)).status, 200);
  }
  assert.deepEqual([...records.values()], [{ image: shared.image }]);
  assert.deepEqual(events, ['connect']);
});

test('create and replace database write errors retain media and identify the new upload for review', async () => {
  user = { publicMetadata: { role: 'admin' } };
  const existing = { _id: editId, image: 'https://example.test/old.jpg', imagePublicId: 'existing' };
  const writeFailed = async () => { throw new Error('private DB write failure details'); };
  collection = { findOne: async () => existing, updateOne: writeFailed, insertOne: writeFailed };
  const responses = [
    await adminRoutes.POST(galleryRequest('POST', { imageFile })),
    await adminRoutes.PUT(editRequest({ imageFile })),
  ];
  for (const response of responses) {
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { success: false, error: 'Request failed. Please try again.' });
  }
  assert.equal(existing.imagePublicId, 'existing');
  assert.deepEqual(events, ['connect', 'upload', 'upload']);
  assert.deepEqual(review.mock.calls.map(call => call.arguments[0]), ['Gallery create outcome uncertain', 'Gallery update outcome uncertain']);
  const ids = review.mock.calls.map(call => call.arguments[1].publicId);
  assert.notEqual(ids[0], ids[1]);
  for (const id of ids) assert.match(id, /^printing-gallery\//);
});

test('both upload routes and the browser validator enforce the same byte limit', async () => {
  user = { publicMetadata: { role: 'admin' } };
  collection = { insertOne: async () => { events.push('insert'); } };
  for (const offset of [-1, 0, 1]) {
    const bytes = Buffer.alloc(galleryImageLimit + offset);
    const file = new File([bytes], 'fixture.png', { type: 'image/png' });
    const tooLarge = offset > 0;
    assert.equal(getGalleryFileError(file), tooLarge ? galleryImageSizeError : null);
    const standalone = await uploadRoutes.POST(uploadRequest(file));
    const inline = await adminRoutes.POST(galleryRequest('POST', { imageFile: `data:image/png;base64,${bytes.toString('base64')}` }));
    for (const response of [standalone, inline]) {
      assert.equal(response.status, tooLarge ? 413 : 200);
      if (tooLarge) assert.equal((await response.json()).error, galleryImageSizeError);
    }
  }
  assert.deepEqual(events, ['upload', 'connect', 'upload', 'insert', 'upload', 'upload', 'insert']);
});

test('oversized gallery request bodies are rejected before a database or provider call', async () => {
  user = { publicMetadata: { role: 'admin' } };
  const declared = galleryRequest('POST', { imageFile }, { 'Content-Length': String(galleryJsonLimit + 1) });
  assert.equal((await adminRoutes.POST(declared)).status, 413);
  const undeclared = galleryRequest('POST', { description: 'x'.repeat(galleryJsonLimit), imageFile });
  assert.equal(undeclared.headers.get('Content-Length'), null);
  assert.equal((await adminRoutes.POST(undeclared)).status, 413);
  assert.deepEqual(events, []);
});

test('invalid database configuration blocks gallery and upload writes before contacting services', async () => {
  user = { publicMetadata: { role: 'admin' } };
  process.env.VERCEL_ENV = 'preview';
  for (const name of [undefined, '', 'PrintingData', 'admin', 'db with spaces', 'staging\n']) {
    applyEnv({ DATABASE_NAME: name });
    const response = await adminRoutes.POST(galleryRequest('POST', { imageFile }));
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { success: false, error: 'Request failed. Please try again.' });
  }
  const file = new File(['a'], 'fixture.png', { type: 'image/png' });
  assert.equal((await uploadRoutes.POST(uploadRequest(file))).status, 500);
  assert.deepEqual(events, []);
});

test('gallery writes use the configured non-production database name', async () => {
  user = { publicMetadata: { role: 'admin' } };
  applyEnv({ DATABASE_NAME: 'printing_staging', VERCEL_ENV: 'preview', VERCEL_TARGET_ENV: 'staging' });
  collection = { insertOne: async () => { events.push('insert'); } };
  assert.equal((await adminRoutes.POST(galleryRequest('POST', { image: '/images/example.jpg' }))).status, 200);
  assert.deepEqual(databaseNames, ['printing_staging']);
});

test('gallery writes reject image links containing embedded credentials', async () => {
  user = { publicMetadata: { role: 'admin' } };
  const image = 'https://fixture-user:fixture-pass@example.test/photo.jpg';
  assert.equal((await adminRoutes.POST(galleryRequest('POST', { image }))).status, 400);
  assert.equal((await adminRoutes.PUT(editRequest({ image }))).status, 400);
  assert.deepEqual(events, []);
});
