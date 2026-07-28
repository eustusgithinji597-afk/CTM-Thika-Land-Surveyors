import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db-schema.ts', // Adjust path to match your actual schema file location
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
