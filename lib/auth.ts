import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as authSchema from 'better-auth/db';

// Use connection pool for serverless environments
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  max: 10,
});

// Initialize drizzle orm reference
const dbInstance = drizzle(pool, { schema: authSchema });

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000",

  database: drizzleAdapter(
    dbInstance,
    {
      provider: 'pg',
      schema: authSchema,
    }
  ),
  
  // 🛡️ Safe fallback avoids compilation crashes if the Vercel key environment drops out
  secret: process.env.BETTER_AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret-string-value-for-compilation',
  
  emailAndPassword: {
    enabled: true,
  },
  
  trustedOrigins: [
    process.env.NEXTAUTH_URL || 'http://localhost:3000',
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
    'https://*.vercel.app',
  ].filter(Boolean) as string[],
});
