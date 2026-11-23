import { MongoClient, ServerApiVersion } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const defaultDatabaseName = 'printingdata';

export function getDatabaseName() {
  const name = process.env.DATABASE_NAME ?? defaultDatabaseName;
  const normalized = name.toLowerCase();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/.test(name) || name !== name.trim() || ['admin', 'config', 'local'].includes(normalized)) {
    throw new Error('MongoDB database name is invalid');
  }

  const environment = process.env.VERCEL_TARGET_ENV || process.env.VERCEL_ENV;
  const requiresSeparateDatabase = environment ? environment !== 'production' : process.env.VERCEL === '1';
  if (requiresSeparateDatabase && normalized === defaultDatabaseName) {
    throw new Error('A separate MongoDB database name is required for non-production Vercel deployments');
  }
  return name;
}

export async function getMongoDatabase() {
  const name = getDatabaseName();
  const client = await getMongoClient();
  return client.db(name);
}

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error('MongoDB is not configured');

  // Start only at request time and share the connection across calls and hot reloads.
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(uri, {
      serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    globalThis._mongoClientPromise = client.connect().catch(async (error: unknown) => {
      await client.close().catch(() => {});
      globalThis._mongoClientPromise = undefined;
      throw error;
    });
  }
  return globalThis._mongoClientPromise;
}
