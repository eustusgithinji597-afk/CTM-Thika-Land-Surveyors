import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm'; // 👈 Imported the explicit sql template tag
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

// 1. Force environmental mapping configuration load
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error("❌ Critical: DATABASE_URL is missing inside your .env.local file.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const db = drizzle(pool);

// 2. Set your custom admin login details here
const ADMIN_EMAIL = "eustusgithinji597@gmail.com"; 
const ADMIN_PASSWORD = "CTMThika2026"; 
const ADMIN_NAME = "CTM Thika Admin";

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function seedAdmin() {
  console.log("📡 Connecting through connection pooler to seed admin profile...");
  
  try {
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    const timestamp = new Date();
    const userId = crypto.randomUUID();

    // 3. Native Drizzle execution template syntax passing type checking bounds
    await db.execute(sql`
      INSERT INTO "user" (id, name, email, "emailVerified", image, password, role, "createdAt", "updatedAt")
      VALUES (${userId}, ${ADMIN_NAME}, ${ADMIN_EMAIL}, ${true}, ${null}, ${hashedPassword}, ${'admin'}, ${timestamp}, ${timestamp})
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("\n====================================================");
    console.log("✅ PRIMARY ADMINISTRATIVE USER SEEDED SUCCESSFUL!");
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log("====================================================\n");
    console.log("You can now use these credentials to log in at http://localhost:3000/admin/login");

  } catch (error) {
    console.error("💥 Seeding execution failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedAdmin();
