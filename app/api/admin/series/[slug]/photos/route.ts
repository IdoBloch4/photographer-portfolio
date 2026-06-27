// AUTH_DISABLED: restore auth imports and checks once Google OAuth is configured
// import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SeriesImage, SeriesImageLayout } from "@/lib/series";
import sharp from "sharp";

// AUTH_DISABLED: set to false once Google OAuth is configured
const AUTH_DISABLED = true;

const ADMIN_EMAILS = ["idobloch@gmail.com", "tirasc@gmail.com"];

function isAdmin(email?: string | null) {
  return AUTH_DISABLED || (!!email && ADMIN_EMAILS.includes(email));
}

const SERIES_DIR = path.join(process.cwd(), "content", "series");
const PUBLIC_DIR = path.join(process.cwd(), "public");

async function getSeriesFile(slug: string) {
  const filePath = path.join(SERIES_DIR, `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  return { filePath, series: JSON.parse(raw) };
}

async function saveSeriesFile(filePath: string, series: unknown) {
  await fs.writeFile(filePath, JSON.stringify(series, null, 2), "utf8");
}

async function uniqueFilename(dir: string, original: string): Promise<string> {
  const ext = path.extname(original).toLowerCase() || ".jpg";
  const base = path.basename(original, ext).replace(/[^a-z0-9_-]/gi, "_");
  let candidate = `${base}${ext}`;
  let n = 1;
  while (
    await fs
      .access(path.join(dir, candidate))
      .then(() => true)
      .catch(() => false)
  ) {
    candidate = `${base}_${n}${ext}`;
    n++;
  }
  return candidate;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAdmin()) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { slug } = await params;
  const formData = await req.formData();

  const layout = formData.get("layout") as SeriesImageLayout;
  const caption = (formData.get("caption") as string) || undefined;
  const altValues = formData.getAll("alt") as string[];
  const files = formData.getAll("files") as File[];

  if (!files.length) return new Response("No files", { status: 400 });

  const imageDir = path.join(PUBLIC_DIR, "images", "series", slug);
  await fs.mkdir(imageDir, { recursive: true });

  const { filePath, series } = await getSeriesFile(slug);

  const savedNames: string[] = [];
  const dimensions: { width: number; height: number }[] = [];

  for (const file of files) {
    const filename = await uniqueFilename(imageDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(imageDir, filename), buffer);

    const meta = await sharp(buffer).metadata();
    dimensions.push({ width: meta.width ?? 1920, height: meta.height ?? 1280 });
    savedNames.push(filename);
  }

  let newImage: SeriesImage;
  const isMulti = savedNames.length > 1;

  if (isMulti) {
    newImage = {
      src: savedNames,
      layout,
      alt: altValues.length >= savedNames.length
        ? altValues.slice(0, savedNames.length)
        : savedNames.map((_, i) => altValues[i] ?? altValues[0] ?? ""),
      caption,
      width: dimensions[0].width,
      height: dimensions[0].height,
    };
  } else {
    newImage = {
      src: savedNames[0],
      layout,
      alt: altValues[0] ?? "",
      caption,
      width: dimensions[0].width,
      height: dimensions[0].height,
    };
  }

  series.images.push(newImage);
  await saveSeriesFile(filePath, series);

  return NextResponse.json({ image: newImage });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isAdmin()) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { slug } = await params;
  const { filename } = (await req.json()) as { filename: string };

  if (!filename || filename.includes("..")) {
    return new Response("Invalid filename", { status: 400 });
  }

  const filePath = path.join(PUBLIC_DIR, "images", "series", slug, filename);
  await fs.unlink(filePath).catch(() => null);

  const { filePath: seriesFilePath, series } = await getSeriesFile(slug);
  series.images = series.images.filter((img: SeriesImage) => {
    const srcs = Array.isArray(img.src) ? img.src : [img.src];
    return !srcs.includes(filename);
  });

  if (series.cover === filename) {
    const first = series.images[0];
    series.cover = first
      ? Array.isArray(first.src) ? first.src[0] : first.src
      : "";
  }

  await saveSeriesFile(seriesFilePath, series);
  return NextResponse.json({ ok: true });
}
