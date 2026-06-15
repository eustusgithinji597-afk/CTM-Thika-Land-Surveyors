#!/usr/bin/env node
/* eslint-disable no-console */
const path = require("path");
// Load .env.local for local development so the script picks up DATABASE_URL etc.
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });
const { Client } = require("pg");
const http = require("http");

const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";

function missingEnvVars() {
  const needed = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];
  return needed.filter((k) => !process.env[k]);
}

async function checkEnv() {
  console.log("\n[ENV CHECK]");
  const missing = missingEnvVars();
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

    const res = await client.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name IN ('properties','leads')`,
    );

    const present = res.rows.map((r) => r.table_name);
    console.log("Tables present:", present);

    for (const t of ["properties", "leads"]) {
      if (!present.includes(t)) console.warn(`Table missing: ${t}`);
    }

    // print properties columns
    try {
      const cols = await client.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='properties' ORDER BY ordinal_position`,
      );
      console.log("properties columns:");
      cols.rows.forEach((r) => console.log("  ", r.column_name, r.data_type));
    } catch (e) {
      console.warn(
        "Could not list properties columns:",
        e && e.message ? e.message : e,
      );
    }
  } catch (err) {
    console.error(
      "DB connection failed:",
      err && err.message ? err.message : err,
    );
  } finally {
    await client.end().catch(() => {});
  }
}

function httpRequest(path, opts = {}) {
  const url = new URL(path, baseUrl);
  const fetchImpl =
    global.fetch ||
    ((...args) => {
      // minimal fetch using http/https
      return new Promise((resolve, reject) => {
        const u = new URL(args[0]);
        const method = (args[1] && args[1].method) || "GET";
        const headers = (args[1] && args[1].headers) || {};
        const body = (args[1] && args[1].body) || null;
        const lib =
          u.protocol === "https:" ? require("https") : require("http");
        const req = lib.request(u, { method, headers }, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            let parsed = null;
            try {
              parsed = JSON.parse(data);
            } catch (e) {
              parsed = data;
            }
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              json: async () => parsed,
              text: async () => data,
            });
          });
        });
        req.on("error", reject);
        if (body) req.write(body);
        req.end();
      });
    });

  return fetchImpl(url.toString(), opts);
}

async function runE2E() {
  console.log("\n[E2E FLOW]");

  // Task A: Submit a mock lead
  try {
    console.log("- Creating lead via API (public)");
    const payload = JSON.stringify({
      name: "E2E Test Lead",
      phone: "0712345678",
      serviceType: "survey",
    });
    const res = await httpRequest("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });
    const body = await res.json();
    console.log("Lead create status:", res.status, body);
  } catch (e) {
    console.error("Lead create failed:", e && e.message ? e.message : e);
  }

  // Task B: Query leads via API (admin)
  try {
    console.log("- Querying leads via API (admin)");
    const res = await httpRequest("/api/leads");
    const body = await res.json();
    console.log(
      "Leads fetch status:",
      res.status,
      Array.isArray(body) ? `count=${body.length}` : body,
    );
  } catch (e) {
    console.error("Get leads failed:", e && e.message ? e.message : e);
  }

  // Task C: Create property via API (admin)
  let createdId = null;
  try {
    console.log("- Creating property via API (admin)");
    const propertyPayload = JSON.stringify({
      title: "E2E Test Plot " + Date.now(),
      location: "Testville",
      price: 12345.0,
      imageUrl: null,
      imageUrls: [],
      description: "E2E created property",
      status: "available",
      amenities: ["water"],
    });
    const res = await httpRequest("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: propertyPayload,
    });
    const body = await res.json();
    console.log("Property create status:", res.status, body);
    if (res.ok) createdId = body.id || (body && body[0] && body[0].id);
  } catch (e) {
    console.error("Create property failed:", e && e.message ? e.message : e);
  }

  // Task D: Fetch public properties
  try {
    console.log("- Fetching public properties via API");
    const res = await httpRequest("/api/properties");
    const body = await res.json();
    console.log(
      "Public properties status:",
      res.status,
      Array.isArray(body) ? `count=${body.length}` : body,
    );
  } catch (e) {
    console.error(
      "Get public properties failed:",
      e && e.message ? e.message : e,
    );
  }

  // Cleanup
  if (createdId) {
    try {
      console.log("- Cleaning up created property", createdId);
      const res = await httpRequest(`/api/properties?id=${createdId}`, {
        method: "DELETE",
      });
      const body = await res.json();
      console.log("Delete status:", res.status, body);
    } catch (e) {
      console.warn("Cleanup failed:", e && e.message ? e.message : e);
    }
  }
}

async function main() {
  console.log("Verify System (JS) - starting");
  await checkEnv();
  await checkDbTables();
  await runE2E();
  console.log("\nVerify System (JS) - finished");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
