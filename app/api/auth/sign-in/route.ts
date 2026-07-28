import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const response = NextResponse.json({ user: data.user, session: data.session }, { status: 200 });
    response.cookies.set("admin_token", data.session.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Sign-in failed" }, { status: 500 });
  }
}