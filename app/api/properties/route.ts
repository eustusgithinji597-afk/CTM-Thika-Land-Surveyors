import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET() {
  try {
    const { data, error } = await getAdminClient()
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, location, price, imageUrl, imageUrls, description, status, amenities } = body;
    const { data, error } = await getAdminClient()
      .from("properties")
      .insert([{
        title,
        location,
        price: String(price),
        image_url: imageUrl || null,
        image_urls: imageUrls || [],
        description: description || "",
        status: status || "available",
        amenities: amenities || [],
      }])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property", details: { message: error?.message, code: error?.code, detail: error?.detail } },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, location, price, imageUrl, imageUrls, description, status, amenities } = body;
    const { data, error } = await getAdminClient()
      .from("properties")
      .update({
        title,
        location,
        price: String(price),
        image_url: imageUrl || null,
        image_urls: imageUrls || [],
        description: description || "",
        status,
        amenities,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property", details: { message: error?.message, code: error?.code, detail: error?.detail } },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    const { error } = await getAdminClient().from("properties").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property", details: { message: error?.message, code: error?.code, detail: error?.detail } },
      { status: 500 },
    );
  }
}