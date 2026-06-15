import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as authSchema from 'better-auth/db';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const auth = betterAuth({
  database: drizzleAdapter(
    drizzle(client, { schema: authSchema }),
    {
      provider: 'pg',
      schema: authSchema,
    }
  ),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    process.env.NEXTAUTH_URL || 'http://localhost:3000',
  ],
});
