import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './db-schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

let client: Client | null = null;
let db: NodePgDatabase<typeof schema>;

function getClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  client ??= new Client({
    connectionString: process.env.DATABASE_URL,
  });

  return client;
}

export async function initializeDb() {
  if (!db) {
    const pgClient = getClient();
    await pgClient.connect();
    db = drizzle(pgClient, { schema });
  }
  return db;
}

export async function getDb() {
  if (!db) {
    await initializeDb();
  }
  return db;
}

export { schema };
