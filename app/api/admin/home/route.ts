import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json(content.home);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { heroSeriesSlug, heroImageFilename, featuredSeriesSlugs } = await req.json();
  const content = await getSiteContent();
  content.home.heroSeriesSlug = heroSeriesSlug;
  content.home.heroImageFilename = heroImageFilename;
  content.home.featuredSeriesSlugs = featuredSeriesSlugs;
  await saveSiteContent(content);
  return NextResponse.json({ ok: true });
}
