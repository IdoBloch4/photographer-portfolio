import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/auth";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SeriesImage } from "@/lib/series";

const SERIES_DIR = path.join(process.cwd(), "content", "series");

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { images, cover } = (await req.json()) as { images: SeriesImage[]; cover: string };

  const filePath = path.join(SERIES_DIR, `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  const series = JSON.parse(raw);
  series.images = images;
  series.cover = cover;
  await fs.writeFile(filePath, JSON.stringify(series, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}
