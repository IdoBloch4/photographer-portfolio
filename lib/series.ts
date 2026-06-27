import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * One image in a series. `layout` controls the editorial slot it occupies
 * inside the series flow. See components/gallery/layouts/* for renderers.
 */
export type SeriesImageLayout = "full-bleed" | "single" | "pair" | "triptych";

export interface SeriesImage {
  /** File path relative to /public/images/series/{slug}/ */
  src: string | string[];
  layout: SeriesImageLayout;
  alt: string | string[];
  caption?: string;
  /** Width / height in pixels. Required to avoid CLS. */
  width: number;
  height: number;
}

export interface Series {
  slug: string;
  title: string;
  /** Year as number for sort, e.g. 2024 */
  year: number;
  /** Free-form e.g. "Iceland", "Tel Aviv" */
  location?: string;
  /** Tags shown as mono caps under the title */
  tags: string[];
  description: string;
  /** Cover filename — used on /work index and as the shared-element source */
  cover: string;
  /** Display order on /work (lower = earlier) */
  order: number;
  /** If true, excluded from all listings (used for retired/renamed stubs). */
  hidden?: boolean;
  images: SeriesImage[];
}

const SERIES_DIR = path.join(process.cwd(), "content", "series");

/**
 * Read all series JSON files at build time. Cached at module scope —
 * repeated calls during a single build hit disk only once.
 */
let _cache: Series[] | null = null;
export async function getAllSeries(): Promise<Series[]> {
  if (_cache) return _cache;
  const entries = await fs.readdir(SERIES_DIR);
  const files = entries.filter((f) => f.endsWith(".json"));
  const all = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(SERIES_DIR, file), "utf8");
      return JSON.parse(raw) as Series;
    })
  );
  _cache = all.filter((s) => !s.hidden).sort((a, b) => a.order - b.order);
  return _cache;
}

export async function getSeriesBySlug(slug: string): Promise<Series | null> {
  const all = await getAllSeries();
  return all.find((s) => s.slug === slug) ?? null;
}

/** Public web path for an image inside a series. */
export function imageSrc(seriesSlug: string, filename: string): string {
  return `/images/series/${seriesSlug}/${filename}`;
}

/** Flat representation used by the lightbox — one entry per visible photo. */
export interface FlatImage {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

/**
 * Flatten a Series' nested image entries (Pair / Triptych contain arrays) into
 * a single ordered list. The order matches the visual flow on the series page,
 * so passing the index from a click directly to the lightbox lands the user on
 * the same photo.
 */
export function flattenSeriesImages(series: Series): FlatImage[] {
  const out: FlatImage[] = [];
  for (const img of series.images) {
    if (Array.isArray(img.src) && Array.isArray(img.alt)) {
      img.src.forEach((s, i) => {
        out.push({
          src: imageSrc(series.slug, s),
          alt: (img.alt as string[])[i],
          caption: img.caption,
          width: img.width,
          height: img.height,
        });
      });
    } else if (typeof img.src === "string" && typeof img.alt === "string") {
      out.push({
        src: imageSrc(series.slug, img.src),
        alt: img.alt,
        caption: img.caption,
        width: img.width,
        height: img.height,
      });
    }
  }
  return out;
}
