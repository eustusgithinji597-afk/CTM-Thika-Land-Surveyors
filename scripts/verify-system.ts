import { Client } from "pg";

// Import queries (these are TS files; run with ts-node or via ts-node-esm)
import queries from "../lib/supabase-client";

const { propertyQueries, leadQueries } = queries as any;

async function checkEnv() {
  console.log("\n[ENV CHECK]");
  const needed = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];
  const missing = needed.filter((k) => !process.env[k]);
  if (missing.length) {
    console.warn("Missing env vars:", missing);
  } else {
    console.log("All required env vars present");
  }
}

async function checkDbTables() {
  console.log("\n[DB CONNECTIVITY CHECK]");
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log("Connected to database");

    const res = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('properties','leads')
    `);

    const present = res.rows.map((r: any) => r.table_name);
    console.log("Tables present:", present);

    for (const t of ["properties", "leads"]) {
      if (!present.includes(t)) {
        console.warn(`Table missing: ${t}`);
      }
    }

    // quick sample selects
    try {
      const p = await client.query(`SELECT id FROM properties LIMIT 1`);
      console.log("Properties sample rows:", p.rowCount);
    } catch (e: unknown) {
      console.warn("Could not SELECT from properties:", formatError(e));
    }

    try {
      const l = await client.query(`SELECT id FROM leads LIMIT 1`);
      console.log("Leads sample rows:", l.rowCount);
    } catch (e: unknown) {
      console.warn("Could not SELECT from leads:", formatError(e));
    }
  } catch (err: unknown) {
    console.error("DB connection failed:", formatError(err));
  } finally {
    await client.end().catch(() => {});
  }
}

async function runE2E() {
  console.log("\n[E2E FLOW]");

  // Task A: create lead
  try {
    const leadPayload = {
      name: "Test Lead",
      phone: "0712345678",
      serviceType: "survey",
    };
    console.log("\n- Creating lead (public)");
    const lead = await leadQueries.createLead(leadPayload);
    console.log("Lead created:", lead?.id ?? lead);
  } catch (err: any) {
    console.error("Lead create failed:", formatError(err));
  }

  // Task B: query all leads (admin)
  try {
    console.log("\n- Querying all leads (admin)");
    const leads = await leadQueries.getAllLeads();
    console.log("Leads count:", Array.isArray(leads) ? leads.length : leads);
  } catch (err: any) {
    console.error("GetAllLeads failed:", formatError(err));
  }

  // Task C: create property (admin)
  let createdPropertyId: string | null = null;
  try {
    console.log("\n- Creating property (admin)");
    const propertyPayload = {
      title: "Verification Plot " + Date.now(),
      location: "Testland",
      price: "12345.00",
      imageUrl: null,
      imageUrls: [],
      description: "E2E test property",
      status: "available",
      amenities: ["water", "electricity"],
    };
    const prop = await propertyQueries.createProperty(propertyPayload);
    createdPropertyId = prop?.id;
    console.log("Property created:", createdPropertyId ?? prop);
  } catch (err: any) {
    console.error("CreateProperty failed:", formatError(err));
  }

  // Task D: fetch public-facing listings
  try {
    console.log("\n- Fetching public properties");
    const props = await propertyQueries.getAllProperties();
    console.log(
      "Public properties count:",
      Array.isArray(props) ? props.length : props,
    );
  } catch (err: any) {
    console.error("GetAllProperties failed:", formatError(err));
  }

  // Cleanup: attempt to delete created entries if we have admin access
  if (createdPropertyId) {
    try {
      console.log("\n- Cleaning up test property", createdPropertyId);
      await propertyQueries.deleteProperty(createdPropertyId);
      console.log("Deleted test property");
    } catch (err: any) {
      console.warn("Cleanup delete failed:", formatError(err));
    }
  }
}

function formatError(err: any) {
  if (!err) return err;
  if (err?.message)
    return { message: err.message, details: err?.details ?? null };
  return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
}

async function main() {
  console.log("Verify System Script - starting");
  await checkEnv();
  await checkDbTables();
  await runE2E();
  console.log("\nVerify System Script - finished");
}

main().catch((e) => {
  console.error("Fatal error in verify-system:", e);
  process.exit(1);
});
