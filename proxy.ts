import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};