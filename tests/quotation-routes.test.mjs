import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { registerHooks } from 'node:module';
import { after, beforeEach, mock, test } from 'node:test';
import { MongoClient, MongoServerError } from 'mongodb';

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) {
      return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
    }
    return nextResolve(specifier, context);
  },
});

const savedEnv = Object.fromEntries(['DATABASE_URL', 'DATABASE_NAME', 'CLERK_SECRET_KEY', 'VERCEL', 'VERCEL_ENV', 'VERCEL_TARGET_ENV'].map(key => [key, process.env[key]]));
const inquiries = new Map();
const buckets = new Map();
const calls = [];
let user;
let databaseFailure;
let expectedDatabaseName;
function duplicateError() {
  return new MongoServerError({ message: 'Test unique key collision', code: 11000 });
}

const quotes = {
  createIndex: async () => {},
  findOne: async ({ _id }) => inquiries.get(_id) ?? null,
  insertOne: async (record) => {
    if (databaseFailure) throw new Error('Synthetic private database error');
    if (inquiries.has(record._id) || [...inquiries.values()].some(other => (
      other.fingerprint === record.fingerprint && other.day === record.day
    ))) throw duplicateError();
    inquiries.set(record._id, record);
  },
  find: () => {
    const records = [...inquiries.values()].sort((a, b) => b.submittedAt - a.submittedAt || b._id.localeCompare(a._id));
    let offset;
    let size;
    return {
      sort() { return this; },
      skip(value) { offset = value; return this; },
      limit(value) { size = value; return this; },
      async toArray() { return records.slice(offset, offset + size); },
    };
  },
  updateOne: async ({ _id, version }, update) => {
    const existing = inquiries.get(_id);
    if (!existing || existing.version !== version) return { matchedCount: 0 };
    inquiries.set(_id, { ...existing, ...update.$set, version: version + update.$inc.version });
    return { matchedCount: 1 };
  },
};
const limits = {
  createIndex: async () => {},
  updateOne: async ({ _id, count }, update, options) => {
    const current = buckets.get(_id);
    if ((current?.count ?? 0) >= count.$lt) {
      if (options?.upsert) throw duplicateError();
      return { matchedCount: 0 };
    }
    if (!current && !options?.upsert) return { matchedCount: 0 };
    buckets.set(_id, {
      count: (current?.count ?? 0) + update.$inc.count,
      expiresAt: current?.expiresAt ?? update.$setOnInsert.expiresAt,
    });
    return { matchedCount: current ? 1 : 0 };
  },
};

mock.module('@clerk/nextjs/server', { namedExports: { currentUser: async () => user } });
mock.method(MongoClient.prototype, 'connect', async function () {
  calls.push('connect');
  return this;
});
mock.method(MongoClient.prototype, 'db', (name) => ({
  collection(collection) {
    assert.equal(name, expectedDatabaseName);
    if (collection === 'quotations') return quotes;
    assert.equal(collection, 'quotationRateLimits');
    return limits;
  },
}));
mock.method(console, 'error', () => {});

const publicApi = await import('../app/api/quotations/route.ts');
const admin = await import('../app/api/admin/quotations/route.ts');

beforeEach(() => {
  user = null;
  databaseFailure = false;
  expectedDatabaseName = 'printingdata';
  inquiries.clear();
  buckets.clear();
  calls.length = 0;
  delete globalThis._mongoClientPromise;
  process.env.DATABASE_URL = 'mongodb://127.0.0.1:1';
  process.env.CLERK_SECRET_KEY = 'synthetic-quote-hash-key';
  delete process.env.DATABASE_NAME;
  delete process.env.VERCEL;
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_TARGET_ENV;
});

after(() => {
  hooks.deregister();
  mock.restoreAll();
  delete globalThis._mongoClientPromise;
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

const form = {
  name: '  Amal  Khan  ',
  email: 'amal@example.test',
  phone: '+92 300 1234567',
  company: ' Example Co ',
  service: 'Packaging',
  message: '  500 boxes\r\nBlue finish\u0000  ',
  website: '',
};

test('quotation writes use the configured staging database and fail before connecting without it', async () => {
  process.env.VERCEL_ENV = 'preview';
  const request = () => new Request('https://example.test/api/quotations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, submissionId: randomUUID() }),
  });
  assert.equal((await publicApi.POST(request())).status, 503);
  assert.deepEqual(calls, []);
  expectedDatabaseName = 'printing_staging';
  process.env.DATABASE_NAME = expectedDatabaseName;
  assert.equal((await publicApi.POST(request())).status, 200);
  assert.equal(inquiries.size, 1);
});

function request(path, method = 'GET', body, headers) {
  return new Request(`https://example.test${path}`, {
    method,
    body: typeof body === 'string' ? body : JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Origin: 'https://example.test', ...headers },
  });
}

function submit(fields = {}, headers) {
  return publicApi.POST(request('/api/quotations', 'POST', { ...form, submissionId: randomUUID(), ...fields }, headers));
}

test('a public submission stores sanitized fields and exposes no inquiry data', async () => {
  const id = randomUUID();
  const response = await submit({ submissionId: id, status: 'completed', version: 22 });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(publicApi.GET, undefined);
  const item = inquiries.get(id);
  assert.equal(item.name, 'Amal Khan');
  assert.equal(item.company, 'Example Co');
  assert.equal(item.message, '500 boxes\nBlue finish');
  assert.equal(item.status, 'new');
  assert.equal(item.version, 0);
  assert.ok(item.submittedAt instanceof Date);
  assert.equal(Object.hasOwn(item, 'website'), false);
});

test('invalid fields, oversized input, cross-site requests and the honeypot never reach storage', async () => {
  for (const invalid of [
    { name: '\u0000 ' }, { email: 'no-email' }, { phone: 'abc123' }, { service: 'Unlisted' },
    { message: 'x'.repeat(4001) }, { company: ['company'] }, { submissionId: 'invalid' },
    { website: 'https://example.test' },
  ]) {
    assert.equal((await submit(invalid)).status, 400);
  }
  assert.equal((await submit({}, { Origin: 'https://elsewhere.test' })).status, 400);
  assert.equal((await submit({}, { 'Content-Type': 'text/plain' })).status, 400);
  assert.equal((await publicApi.POST(request('/api/quotations', 'POST', 'x'.repeat(25 * 1024)))).status, 400);
  assert.equal((await publicApi.POST(request('/api/quotations', 'POST', '{bad-json'))).status, 400);
  assert.deepEqual(calls, []);
});

test('concurrent duplicate submissions and retry tokens produce only one record', async () => {
  const id = randomUUID();
  const responses = await Promise.all([submit({ submissionId: id }), submit({ submissionId: id }), submit()]);
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true });
  }
  assert.equal(inquiries.size, 1);
  const savedId = [...inquiries.keys()][0];
  assert.equal((await submit({ submissionId: savedId, message: 'Changed requirements' })).status, 409);
});

test('the Vercel IP quota returns Retry-After and does not store a raw IP address', async () => {
  process.env.VERCEL = '1';
  process.env.VERCEL_ENV = 'production';
  const headers = { 'x-vercel-forwarded-for': '192.0.2.10' };
  for (let index = 0; index < 8; index++) {
    assert.equal((await submit({ message: `Request ${index}` }, headers)).status, 200);
  }
  const limited = await submit({ message: 'Request nine' }, { ...headers, 'x-forwarded-for': '192.0.2.11' });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('retry-after')) > 0);
  assert.equal(inquiries.size, 8);
  assert.ok([...buckets.keys()].every(key => /^[0-9a-f]{64}$/.test(key)));
  assert.ok([...buckets.values()].every(bucket => bucket.expiresAt instanceof Date));
});

test('outside Vercel only the shared quota applies even if the request claims to have a forwarded IP', async () => {
  const headers = { 'x-vercel-forwarded-for': '192.0.2.20' };
  for (let index = 0; index < 120; index++) {
    assert.equal((await submit({ message: `Local request ${index}` }, headers)).status, 200);
  }
  assert.equal((await submit({ message: 'Local over quota' }, headers)).status, 429);
  assert.equal(buckets.size, 1);
});

test('database write errors return a generic message without PII or driver details', async () => {
  databaseFailure = true;
  const response = await submit();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'We could not accept your quotation right now. Please try again.' });
  assert.equal(inquiries.size, 0);
});

test('signed-out and non-admin users cannot read or update the inbox', async () => {
  for (const [session, status] of [[null, 401], [{ publicMetadata: { role: 'member' } }, 403]]) {
    user = session;
    assert.equal((await admin.GET(request('/api/admin/quotations'))).status, status);
    assert.equal((await admin.PATCH(request('/api/admin/quotations', 'PATCH', { id: randomUUID() }))).status, status);
  }
  assert.deepEqual(calls, []);
});

test('an administrator can read an uncached inbox and change status without overwriting a newer edit', async () => {
  const id = randomUUID();
  await submit({ submissionId: id });
  user = { publicMetadata: { role: 'admin' } };
  const list = await admin.GET(request('/api/admin/quotations?page=1'));
  assert.equal(list.status, 200);
  assert.equal(list.headers.get('cache-control'), 'private, no-store');
  const { items } = await list.json();
  assert.equal(items[0].email, form.email);
  assert.equal(items[0].phone, form.phone);
  assert.equal(items[0].id, id);
  assert.equal(items[0].status, 'new');
  assert.equal(Object.hasOwn(items[0], 'fingerprint'), false);

  const patch = (status, version, target = id) => admin.PATCH(request('/api/admin/quotations', 'PATCH', {
    id: target, status, version, email: 'attacker@example.test',
  }));
  assert.equal((await patch('invalid', 0)).status, 400);
  assert.equal((await patch('contacted', 0, randomUUID())).status, 404);
  const firstEdit = await patch('contacted', 0);
  assert.deepEqual(await firstEdit.json(), { status: 'contacted', version: 1 });
  assert.equal((await patch('completed', 0)).status, 409);
  assert.equal((await patch('completed', 1)).status, 200);
  assert.equal((await patch('new', 2)).status, 200);
  assert.equal(inquiries.get(id).status, 'new');
  assert.equal(inquiries.get(id).email, form.email);
});
