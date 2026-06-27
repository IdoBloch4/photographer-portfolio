// AUTH_DISABLED: restore this once next-auth is installed and Google OAuth is configured
// import { handlers } from "@/auth";
// export const { GET, POST } = handlers;

import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ disabled: true }); }
export function POST() { return NextResponse.json({ disabled: true }); }
