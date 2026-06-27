import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// AUTH_DISABLED: set to false once Google OAuth is configured in .env.local
const AUTH_DISABLED = true;

export function middleware(req: NextRequest) {
  if (AUTH_DISABLED) return NextResponse.next();

  // Re-enable this block when AUTH_DISABLED is set back to false:
  // import { auth } from "@/auth";
  // export default auth((req) => { ... });
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
