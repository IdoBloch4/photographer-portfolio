/**
 * Copy Sarit's exported JPGs from her Pictures folder into the project,
 * renaming to the project's filename convention and reading intrinsic
 * dimensions so the series JSONs can be updated with correct width/height.
 *
 * Run with:  node scripts/import-photos.mjs
 *
 * Edit the `map` below if she adds/removes photos. Re-running is idempotent
 * — files are overwritten, dimensions are re-read.
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SOURCE = "C:/Users/idobl/Pictures/TirasPhotos";
const DEST = path.join(ROOT, "public", "images", "series");

// Series are organized by photo CATEGORY (genre) — not location.
// Multiple trips can populate the same category; each photo just needs to land
// in the right slot.
const map = {
  // Landscape: Greece + Slovenia + Lofoten — five real photos so far
  "2025-09 - Greece - _C_C6273-export.jpg":      ["landscape", "01.jpg"], // alpenglow road
  "2025-09 - Greece - _C_C6417-HDR-export.jpg":  ["landscape", "02.jpg"], // stone bridge
  "2502 - Lofoten - _C_C4989-export.jpg":        ["landscape", "03.jpg"], // Reine in Arctic light
  "2502 - Lofoten - _C_C5973-export.jpg":        ["landscape", "04.jpg"], // coastal Lofoten
  "2026-03 - Slovenia - _C_C3837-export.jpg":    ["landscape", "05.jpg"], // alpine cabin

  // Street: Amsterdam — two real photos so far
  "2026-02-24 - Amsterdam - _C_C2016-export.jpg": ["street", "01.jpg"], // canal houses
  "2026-02-24 - Amsterdam - _C_C2082-export.jpg": ["street", "02.jpg"], // cyclist + arch

  // Macro / Astro / Abstract — no real photos yet, all placeholders
};

// Source photos > MAX_LONG_EDGE are downscaled. next/image's largest
// configured deviceSize is 2560, so anything bigger is wasted bytes — even
// the lightbox requests the 2560 variant. Quality 92 mozjpeg is virtually
// indistinguishable from the source visually.
const MAX_LONG_EDGE = 2560;

const results = [];
for (const [src, [slug, target]] of Object.entries(map)) {
  const srcPath = path.join(SOURCE, src);
  const destDir = path.join(DEST, slug);
  await fs.mkdir(destDir, { recursive: true });
  const destPath = path.join(destDir, target);

  const srcMeta = await sharp(srcPath).metadata();
  const longEdge = Math.max(srcMeta.width, srcMeta.height);
  let pipeline = sharp(srcPath).rotate(); // honor EXIF orientation, then strip
  if (longEdge > MAX_LONG_EDGE) {
    pipeline = pipeline.resize({
      width: srcMeta.width >= srcMeta.height ? MAX_LONG_EDGE : null,
      height: srcMeta.height > srcMeta.width ? MAX_LONG_EDGE : null,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await pipeline
    .jpeg({ quality: 92, mozjpeg: true })
    .withMetadata({ exif: {} }) // strip EXIF for privacy + smaller file
    .toFile(destPath);

  const outMeta = await sharp(destPath).metadata();
  const bytes = (await fs.stat(destPath)).size;
  results.push({
    slug,
    target,
    width: outMeta.width,
    height: outMeta.height,
    bytes,
  });
  console.log(
    `  ${slug}/${target}  ${srcMeta.width}×${srcMeta.height} → ${outMeta.width}×${outMeta.height}  ${Math.round(bytes / 1024)}KB`
  );
}

console.log("\nimport summary (paste into series JSONs):");
console.log(JSON.stringify(results, null, 2));
