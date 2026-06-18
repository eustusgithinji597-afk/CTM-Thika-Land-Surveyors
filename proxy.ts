import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Admin auth enforcement can be added here when session validation is finalized.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
