// AUTH_DISABLED: restore auth imports and checks once Google OAuth is configured
// import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SeriesImage } from "@/lib/series";

// AUTH_DISABLED: set to false once Google OAuth is configured
const AUTH_DISABLED = true;

const ADMIN_EMAILS = ["idobloch@gmail.com", "tirasc@gmail.com"];

function isAdmin(email?: string | null) {
  return AUTH_DISABLED || (!!email && ADMIN_EMAILS.includes(email));
}

const SERIES_DIR = path.join(process.cwd(), "content", "series");

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { images, cover } = (await req.json()) as {
    images: SeriesImage[];
    cover: string;
  };

  const filePath = path.join(SERIES_DIR, `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  const series = JSON.parse(raw);

  series.images = images;
  series.cover = cover;

  await fs.writeFile(filePath, JSON.stringify(series, null, 2), "utf8");
  return NextResponse.json({ ok: true });
}
