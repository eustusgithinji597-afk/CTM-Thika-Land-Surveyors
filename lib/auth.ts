import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as authSchema from 'better-auth/db';

// 🔌 Use a multi-client Pool on port 6543 to auto-manage parallel requests
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Bypasses self-signed SSL blocks on cloud infrastructures
  }
});

// Initialize drizzle orm reference
const dbInstance = drizzle(pool, { schema: authSchema });

export const auth = betterAuth({
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
    'https://vercel.app' // Add your production domain link string here
  ],
});
