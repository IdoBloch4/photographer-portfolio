import { NextRequest, NextResponse } from "next/server";

/**
 * Route protection via cookie presence check.
 * Full session validation happens in the admin layout (Node.js runtime).
 * next-auth v4 session cookie names:
 *   - http (dev):  next-auth.session-token
 *   - https (prod): __Secure-next-auth.session-token
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const hasSession =
      req.cookies.has("next-auth.session-token") ||
      req.cookies.has("__Secure-next-auth.session-token");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
