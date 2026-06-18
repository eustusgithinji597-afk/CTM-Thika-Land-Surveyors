// Supabase Client for real-time database operations.

import { createClient, type RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type SupabasePayload = RealtimePostgresChangesPayload<Record<string, unknown>>;
type UntypedSupabaseClient = {
  from: (table: string) => any;
};

// Public client configuration values are intentionally allowed to be empty at
// compile time so Vercel builds can complete before runtime env vars are wired.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabasePublic =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    : null;

function getSupabasePublic() {
  if (!supabasePublic) {
    throw new Error("Supabase public credentials are not configured");
  }

  return supabasePublic;
}

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (supabaseAdminClient) return supabaseAdminClient;

  if (typeof window !== "undefined") {
    throw new Error("Supabase admin client cannot be used in the browser");
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured");
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

function getUntypedSupabaseAdmin(): UntypedSupabaseClient {
  return getSupabaseAdmin() as UntypedSupabaseClient;
}

export const propertyQueries = {
  async getAllProperties() {
    const { data, error } = await getSupabasePublic()
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAllPropertiesAdmin() {
    const { data, error } = await getUntypedSupabaseAdmin()
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPropertyById(id: string) {
    const { data, error } = await getSupabasePublic()
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProperty(property: Record<string, unknown>) {
    const formattedProperty = {
      ...property,
      price: property.price ? String(property.price) : "0.00",
    };

    const { data, error } = await getUntypedSupabaseAdmin()
      .from("properties")
      .insert([formattedProperty])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateProperty(id: string, updates: Record<string, unknown>) {
    const formattedUpdates = { ...updates };
    if (updates.price) {
      formattedUpdates.price = String(updates.price);
    }

    const { data, error } = await getUntypedSupabaseAdmin()
      .from("properties")
      .update(formattedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProperty(id: string) {
    const { error } = await getSupabaseAdmin()
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  subscribeToProperties(callback: (payload: SupabasePayload) => void) {
    const channel = getSupabasePublic()
      .channel("properties-realtime-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
        },
        callback,
      )
      .subscribe();

    return channel;
  },
};

export const leadQueries = {
  async getAllLeads() {
    const { data, error } = await getUntypedSupabaseAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUnreadLeads() {
    const { data, error } = await getSupabaseAdmin()
      .from("leads")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createLead(lead: Record<string, unknown>) {
    const { data, error } = await getSupabasePublic()
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLeadStatus(id: string, status: "new" | "contacted") {
    const { data, error } = await getUntypedSupabaseAdmin()
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToLeads(callback: (payload: SupabasePayload) => void) {
    const channel = getSupabasePublic()
      .channel("leads-realtime-feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        callback,
      )
      .subscribe();

    return channel;
  },

  async getLeadMetrics() {
    const currentAdmin = getSupabaseAdmin();

    const { count: newCount, error: errorNew } = await currentAdmin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    const { count: contactedCount, error: errorContacted } = await currentAdmin
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "contacted");

    if (errorNew || errorContacted) {
      return { newLeads: 0, contactedLeads: 0, totalLeads: 0 };
    }

    const activeNew = newCount || 0;
    const activeContacted = contactedCount || 0;

    return {
      newLeads: activeNew,
      contactedLeads: activeContacted,
      totalLeads: activeNew + activeContacted,
    };
  },
};

export const storageQueries = {
  async uploadPropertyImages(propertyId: string, files: File[]) {
    const uploadedUrls: string[] = [];
    const currentAdmin = getSupabaseAdmin();

    for (const file of files) {
      const fileName = `${propertyId}/${Date.now()}-${file.name}`;

      const { error } = await currentAdmin.storage
        .from("property-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: publicData } = currentAdmin.storage
        .from("property-images")
        .getPublicUrl(fileName);

      uploadedUrls.push(publicData.publicUrl);
    }

    return uploadedUrls;
  },

  async deletePropertyImage(imagePath: string) {
    const { error } = await getSupabaseAdmin()
      .storage.from("property-images")
      .remove([imagePath]);

    if (error) throw error;
    return true;
  },
};

export default {
  propertyQueries,
  leadQueries,
  storageQueries,
};
