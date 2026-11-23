import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { MongoServerError } from 'mongodb';
import { getMongoDatabase } from '@/lib/mongodb';
import type { InboxQuotation, QuoteDetails, QuoteStatus } from '@/lib/quotations/contracts';

type Quotation = QuoteDetails & {
  _id: string;
  fingerprint: string;
  day: string;
  status: QuoteStatus;
  submittedAt: Date;
  updatedAt: Date;
  version: number;
};

type RateBucket = { _id: string; count: number; expiresAt: Date };

const pageSize = 20;
const rateWindow = 15 * 60 * 1000;
let indexes: Promise<unknown> | undefined;

async function getStore() {
  const db = await getMongoDatabase();
  const quotations = db.collection<Quotation>('quotations');
  const limits = db.collection<RateBucket>('quotationRateLimits');

  return { quotations, limits };
}

function keyedHash(purpose: string, value: string) {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) throw new Error('Quotation hashing is not configured');
  return createHmac('sha256', secret).update(`awais-quotations/v1:${purpose}:${value}`).digest('hex');
}

function duplicateKey(error: unknown) {
  return error instanceof MongoServerError && error.code === 11000;
}

async function reserveQuota(store: Awaited<ReturnType<typeof getStore>>, scope: string, max: number, end: Date) {
  const _id = keyedHash('quota', `${scope}:${end.getTime()}`);
  const filter = { _id, count: { $lt: max } };
  try {
    await store.limits.updateOne(filter, { $inc: { count: 1 }, $setOnInsert: { expiresAt: end } }, { upsert: true });
    return true;
  } catch (error) {
    if (!duplicateKey(error)) throw error;
    // An upsert can collide with a new bucket or an existing bucket that is already full.
    const result = await store.limits.updateOne(filter, { $inc: { count: 1 } });
    return result.matchedCount === 1;
  }
}

export async function submitQuotation(request: Request, id: string, details: QuoteDetails, now = new Date()) {
  const store = await getStore();
  indexes ??= Promise.all([
    store.quotations.createIndex({ fingerprint: 1, day: 1 }, { unique: true, name: 'quotation_daily_duplicate' }),
    store.quotations.createIndex({ submittedAt: -1, _id: -1 }, { name: 'quotation_inbox_order' }),
    store.limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'quotation_rate_expiration' }),
  ]).catch((error: unknown) => {
    indexes = undefined;
    throw error;
  });
  await indexes;

  const fingerprint = keyedHash('inquiry', JSON.stringify([
    details.name.toLowerCase(), details.email.toLowerCase(), details.phone.replace(/\D/g, ''),
    details.company.toLowerCase(), details.service, details.message.replace(/\s+/gu, ' '),
  ]));
  const replay = await store.quotations.findOne({ _id: id }, { projection: { fingerprint: 1 } });
  if (replay) return { kind: replay.fingerprint === fingerprint ? 'duplicate' : 'conflict' } as const;

  const ip = process.env.VERCEL === '1' ? request.headers.get('x-vercel-forwarded-for')?.trim() : undefined;
  const end = new Date((Math.floor(now.getTime() / rateWindow) + 1) * rateWindow);
  const ipAllowed = !ip || !isIP(ip) || await reserveQuota(store, `ip:${ip}`, 8, end);
  const siteAllowed = ipAllowed && await reserveQuota(store, 'site', 120, end);
  if (!siteAllowed) {
    return { kind: 'limited', retryAfter: Math.ceil((end.getTime() - now.getTime()) / 1000) } as const;
  }

  const quotation: Quotation = {
    ...details,
    _id: id,
    fingerprint,
    day: now.toISOString().slice(0, 10),
    submittedAt: now,
    updatedAt: now,
    status: 'new',
    version: 0,
  };

  try {
    await store.quotations.insertOne(quotation);
    return { kind: 'created', id } as const;
  } catch (error) {
    if (!duplicateKey(error)) throw error;
    const saved = await store.quotations.findOne({ _id: id }, { projection: { fingerprint: 1 } });
    return { kind: saved && saved.fingerprint !== fingerprint ? 'conflict' : 'duplicate' } as const;
  }
}

export async function listQuotations(page: number) {
  const { quotations } = await getStore();
  const records = await quotations.find({}, { projection: { fingerprint: 0, day: 0 } })
    .sort({ submittedAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize + 1).toArray();
  const items: InboxQuotation[] = records.slice(0, pageSize).map(record => ({
    id: record._id,
    name: record.name,
    email: record.email,
    phone: record.phone,
    company: record.company,
    service: record.service,
    message: record.message,
    submittedAt: record.submittedAt.toISOString(),
    status: record.status,
    version: record.version,
  }));
  return { items, hasNext: records.length > pageSize };
}

export async function updateQuotationStatus(id: string, status: QuoteStatus, version: number) {
  const { quotations } = await getStore();
  const result = await quotations.updateOne(
    { _id: id, version },
    { $set: { status, updatedAt: new Date() }, $inc: { version: 1 } },
  );
  if (result.matchedCount) return 'updated';
  return await quotations.findOne({ _id: id }, { projection: { _id: 1 } }) ? 'conflict' : 'missing';
}
