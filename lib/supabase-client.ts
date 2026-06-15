// Supabase Client for Real-time Database Operations
// This utility simplifies queries and real-time subscriptions

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client configuration values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Client-side Supabase client (public read-only for most operations)
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

let supabaseAdminClient: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (supabaseAdminClient) return supabaseAdminClient;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // 🛡️ SAFE FALLBACK: If executed in the browser context, divert gracefully 
  // to the public client instead of throwing a hard application crash.
  if (typeof window !== 'undefined' || !serviceRoleKey) {
    console.warn("⚠️ Redirecting to public instance layer inside browser viewport.");
    return supabasePublic;
  }

  supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

// Property Database Operations
export const propertyQueries = {
  // Fetch all available properties (public layout)
  async getAllProperties() {
    const { data, error } = await supabasePublic
      .from("properties")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Fetch all properties including sold entries (admin dashboard grid)
  async getAllPropertiesAdmin() {
    const { data, error } = await getSupabaseAdmin()
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Fetch single property by structural database key ID
  async getPropertyById(id: string) {
    const { data, error } = await supabasePublic
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new property listing (admin dashboard panels)
  async createProperty(property: any) {
    // 🎛️ Fix database string cast issues for KES numeric prices safely
    const formattedProperty = {
      ...property,
      price: property.price ? String(property.price) : "0.00"
    };

    const { data, error } = await getSupabaseAdmin()
      .from("properties")
      .insert([formattedProperty])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update specific property listings parameters (admin toggle functions)
  async updateProperty(id: string, updates: any) {
    const formattedUpdates = { ...updates };
    if (updates.price) {
      formattedUpdates.price = String(updates.price);
    }

    const { data, error } = await getSupabaseAdmin()
      .from("properties")
      .update(formattedUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Completely purge property rows from tables (admin panel delete triggers)
  async deleteProperty(id: string) {
    const { error } = await getSupabaseAdmin()
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  },

  // Subscribe to property changes via WebSockets (real-time streaming loops)
  subscribeToProperties(callback: (payload: any) => void) {
    const channel = supabasePublic
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

// Lead Database Operations
export const leadQueries = {
  // Fetch all incoming prospective lead records (admin viewport)
  async getAllLeads() {
    const { data, error } = await getSupabaseAdmin()
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Fetch fresh unread customer lead records (admin alert systems)
  async getUnreadLeads() {
    const { data, error } = await getSupabaseAdmin()
      .from("leads")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create and submit a new customer inquiry form row (public ad landing page)
  async createLead(lead: any) {
    const { data, error } = await supabasePublic
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update client interaction status logs (admin verification controls)
  async updateLeadStatus(id: string, status: "new" | "contacted") {
    const { data, error } = await getSupabaseAdmin()
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Subscribe to real-time client intake events (admin desktop alerts)
  subscribeToLeads(callback: (payload: any) => void) {
    // 🛡️ Always fallback to the public channel framework for client viewports
    const clientInstance = typeof window !== 'undefined' ? supabasePublic : getSupabaseAdmin();
    
    const channel = clientInstance
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

  // Aggregate active conversion performance metrics (admin home screen)
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

// Storage Operations for Images
export const storageQueries = {
  // Upload plot media files straight to Supabase Cloud Buckets
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

  // Completely wipe tracking picture assets from cloud server storage files
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
