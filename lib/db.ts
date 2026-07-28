import { createClient } from "@supabase/supabase-js";

let adminClient: ReturnType<typeof createClient> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getAdmin(): any {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  adminClient = createClient(url, key, { auth: { persistSession: false } });
  return adminClient;
}

export const db = {
  async queryProperties() {
    const { data, error } = await getAdmin()
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async queryLeads() {
    const { data, error } = await getAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async insertProperty(values: Record<string, unknown>) {
    const { data, error } = await getAdmin()
      .from("properties")
      .insert([values])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async insertLead(values: Record<string, unknown>) {
    const { data, error } = await getAdmin()
      .from("leads")
      .insert([values])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  get client() {
    return getAdmin();
  },
};

export default db;