import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function checkEnv() {
  console.log("\n[ENV CHECK]");
  const needed = [
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
  if (!url || !serviceKey) {
    console.error("Cannot run DB check: missing credentials");
    return;
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  try {
    const { data: tables, error } = await admin.rpc("get_tables" as any);
    console.log("Tables accessible via REST API");
  } catch {
    // RPC might not exist; try direct selects instead
    console.log("Checking tables via direct queries...");
  }

  try {
    const { data: props, error: pe } = await admin.from("properties").select("id").limit(1);
    if (pe) throw pe;
    console.log("✔ properties table accessible");
  } catch (e: any) {
    console.warn("✖ properties table:", e?.message || e);
  }

  try {
    const { data: leads, error: le } = await admin.from("leads").select("id").limit(1);
    if (le) throw le;
    console.log("✔ leads table accessible");
  } catch (e: any) {
    console.warn("✖ leads table:", e?.message || e);
  }
}

async function runE2E() {
  console.log("\n[E2E FLOW]");
  if (!url || !anonKey || !serviceKey) {
    console.error("Cannot run E2E: missing credentials");
    return;
  }

  const publicClient = createClient(url, anonKey);
  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });

  let createdLeadId: string | null = null;
  let createdPropertyId: string | null = null;

  // Create lead via public client
  try {
    console.log("\n- Creating lead (public)");
    const { data, error } = await publicClient
      .from("leads")
      .insert([{ name: "Test Lead", phone: "0712345678", service_type: "survey" }])
      .select()
      .single();
    if (error) throw error;
    createdLeadId = data?.id;
    console.log("✔ Lead created:", createdLeadId);
  } catch (e: any) {
    console.error("✖ Lead create failed:", e?.message || e);
  }

  // Query all leads via admin
  try {
    console.log("\n- Querying all leads (admin)");
    const { data, error, count } = await adminClient
      .from("leads")
      .select("*", { count: "exact" });
    if (error) throw error;
    console.log("✔ Leads count:", count ?? data?.length ?? 0);
  } catch (e: any) {
    console.error("✖ GetAllLeads failed:", e?.message || e);
  }

  // Create property via admin
  try {
    console.log("\n- Creating property (admin)");
    const { data, error } = await adminClient
      .from("properties")
      .insert([{
        title: "Verification Plot " + Date.now(),
        location: "Testland",
        price: "12345.00",
        description: "E2E test property",
        status: "available",
        amenities: ["water", "electricity"],
      }])
      .select()
      .single();
    if (error) throw error;
    createdPropertyId = data?.id;
    console.log("✔ Property created:", createdPropertyId);
  } catch (e: any) {
    console.error("✖ CreateProperty failed:", e?.message || e);
  }

  // Fetch public listings
  try {
    console.log("\n- Fetching public properties");
    const { data, error } = await publicClient
      .from("properties")
      .select("*")
      .eq("status", "available");
    if (error) throw error;
    console.log("✔ Public properties count:", data?.length ?? 0);
  } catch (e: any) {
    console.error("✖ GetAllProperties failed:", e?.message || e);
  }

  // Cleanup
  if (createdPropertyId) {
    try {
      console.log("\n- Cleaning up test property", createdPropertyId);
      const { error } = await adminClient.from("properties").delete().eq("id", createdPropertyId);
      if (error) throw error;
      console.log("✔ Deleted test property");
    } catch (e: any) {
      console.warn("Cleanup delete failed:", e?.message || e);
    }
  }
  if (createdLeadId) {
    try {
      const { error } = await adminClient.from("leads").delete().eq("id", createdLeadId);
      if (error) throw error;
      console.log("✔ Deleted test lead");
    } catch (e: any) {
      console.warn("Cleanup lead delete failed:", e?.message || e);
    }
  }
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