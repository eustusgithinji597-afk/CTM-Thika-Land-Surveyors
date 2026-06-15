import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// 🔌 Explicitly force Drizzle to read your Next.js local environment variables file
dotenv.config({ path: '.env.local' });

export default defineConfig({
  schema: './lib/db-schema.ts', // Adjust path to match your actual schema file location
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
