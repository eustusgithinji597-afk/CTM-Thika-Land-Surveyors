import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './db-schema';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

let db: ReturnType<typeof drizzle>;

export async function initializeDb() {
  if (!db) {
    await client.connect();
    db = drizzle(client, { schema });
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
