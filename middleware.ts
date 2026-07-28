import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚡ CRITICAL FIX: Changed from 'proxy' to 'middleware' so Next.js actually runs it
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except the login page itself
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

      const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
        auth: { persistSession: false } 
      });
      
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data?.user) {
        // Clear the bad/expired cookie so the user isn't stuck in a loop
        const response = NextResponse.redirect(new URL("/admin/login", request.url));
        response.cookies.delete("admin_token");
        return response;
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
