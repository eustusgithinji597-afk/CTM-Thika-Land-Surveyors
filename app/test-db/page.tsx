"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestDbPage() {
  const [status, setStatus] = useState<string>("Initializing...");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function runTest() {
      setStatus("Checking environment variables...");
      if (!supabaseUrl || !supabaseAnonKey) {
        setError({
          message:
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
          supabaseUrl,
          supabaseAnonKey,
        });
        setStatus("Environment variables missing");
        return;
      }

      setStatus("Inserting test record...");
      const insertPayload = {
        title: "Diagnostic Test Plot",
        location: "Test Location",
        price: "12345.00",
        image_url: null,
        image_urls: [],
        description: "This is a temporary diagnostic record.",
        status: "available",
        amenities: ["water"],
      };

      const { data: insertData, error: insertError } = await supabase
        .from("properties")
        .insert([insertPayload])
        .select();

      if (insertError) {
        setError({ operation: "insert", details: insertError });
        setStatus("Insert failed");
        return;
      }

      setStatus("Insert succeeded, querying properties...");
      const { data: selectData, error: selectError } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (selectError) {
        setError({ operation: "select", details: selectError, insertData });
        setStatus("Select failed");
        return;
      }

      setResult({ inserted: insertData, recent: selectData });
      setStatus("Test completed");
    }

    runTest();
  }, []);

  return (
    <main className="min-h-screen bg-background text-slate-900 p-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Diagnostic Test</h1>
      <p className="mb-4">
        This page checks public Supabase client connectivity and runs a basic
        insert/select against <code>properties</code>.
      </p>
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Supabase URL:</strong> {supabaseUrl || "<missing>"}
        </div>
        <div>
          <strong>Anon key loaded:</strong> {supabaseAnonKey ? "yes" : "no"}
        </div>
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <h2 className="font-semibold text-red-700">Error payload</h2>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
        {result && (
          <div className="rounded-lg border border-green-300 bg-green-50 p-4">
            <h2 className="font-semibold text-green-700">Result payload</h2>
            <pre className="whitespace-pre-wrap text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
