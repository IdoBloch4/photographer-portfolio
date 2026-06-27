import { promises as fs } from "node:fs";
import path from "node:path";
import { getPlaiceholder } from "plaiceholder";

/**
 * Generate a base64 LQIP for a public-folder image at build time.
 * Returns null if the file doesn't exist (so missing-photo cases don't crash
 * the build during scaffolding — they render with no blur instead).
 */
const _lqipCache = new Map<string, string>();

export async function getBlurDataURL(publicPath: string): Promise<string | null> {
  if (_lqipCache.has(publicPath)) return _lqipCache.get(publicPath)!;
  const filePath = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  try {
    const buffer = await fs.readFile(filePath);
    const { base64 } = await getPlaiceholder(buffer, { size: 12 });
    _lqipCache.set(publicPath, base64);
    return base64;
  } catch {
    return null;
  }
}
