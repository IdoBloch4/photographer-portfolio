// AUTH_DISABLED: restore auth imports and checks once Google OAuth is configured
// import { auth } from "@/auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import { NextResponse } from "next/server";
import type { SiteContent } from "@/lib/site-content";

// AUTH_DISABLED: set to false once Google OAuth is configured
const AUTH_DISABLED = true;

const ADMIN_EMAILS = ["idobloch@gmail.com", "tirasc@gmail.com"];

function isAdmin(email?: string | null) {
  return AUTH_DISABLED || (!!email && ADMIN_EMAILS.includes(email));
}

export async function GET() {
  // AUTH_DISABLED: restore → const session = await auth();
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  // AUTH_DISABLED: restore → const session = await auth(); if (!isAdmin(session?.user?.email)) ...
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as SiteContent;
  await saveSiteContent(body);
  return NextResponse.json({ ok: true });
}
