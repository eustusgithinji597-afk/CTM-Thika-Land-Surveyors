import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect admin routes and enforce authentication
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin/* routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for auth session/token
    // In a real app, verify the session token here
    // For now, this middleware structure is in place for future auth checks
    // Example check (implement based on your auth system):
    // const session = request.cookies.get('session');
    // if (!session) {
    //   return NextResponse.redirect(new URL('/admin/login', request.url));
    // }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*"],
};
