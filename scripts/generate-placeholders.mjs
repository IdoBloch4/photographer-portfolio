/**
 * Generate placeholder JPGs in palettes hinting at each category's mood.
 * Run when scaffolding new categories — placeholders look intentional, not
 * broken, so the site renders meaningfully before real photos arrive.
 *
 * Idempotent: skips files that already exist (so re-running won't overwrite
 * Sarit's real photos that were copied in via import-photos.mjs).
 *
 * Run with:  node scripts/generate-placeholders.mjs
 */
import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Per-category palettes
const PALETTES = {
  abstractAndDetails:            ["#7A3A4A", "#C67B5C", "#F5E1B8"],
  seascape:                      ["#0A1A2A", "#2A5A7A", "#B8D8E8"],
  mountainAndWaterLandscape:     ["#2A1F18", "#9B5C3F", "#F5E1B8"],
  urbanLandscapeAndArchitecture: ["#1A1A1A", "#3A3A4A", "#C8C0B0"],
  nature:                        ["#3A4A2A", "#7A8C4A", "#E8E1C0"],
  animalsAndWildlife:            ["#2A2A1A", "#6A7A3A", "#D4C89A"],
  street:                        ["#0F1A2A", "#1F2D44", "#C9A04A"],
  miscellaneous:                 ["#2A1A2A", "#7A3A5A", "#F0D8E0"],
  astro:                         ["#0A0A1A", "#241B3A", "#D4C4A8"],
};

const series = [
  { slug: "abstract-and-details", palette: PALETTES.abstractAndDetails,
    images: [{ name:"01.jpg",w:1600,h:1600},{ name:"02.jpg",w:1600,h:2000},{ name:"03.jpg",w:1920,h:1280},{ name:"04.jpg",w:1280,h:1600},{ name:"05.jpg",w:1920,h:1280}] },
  { slug: "seascape", palette: PALETTES.seascape,
    images: [{ name:"01.jpg",w:2560,h:1440},{ name:"02.jpg",w:1920,h:1280},{ name:"03.jpg",w:1920,h:1280},{ name:"04.jpg",w:1920,h:1280},{ name:"05.jpg",w:1920,h:1280}] },
  { slug: "mountain-and-water-landscape", palette: PALETTES.mountainAndWaterLandscape,
    images: [{ name:"01.jpg",w:2560,h:1707},{ name:"02.jpg",w:2560,h:1707},{ name:"03.jpg",w:1920,h:1080},{ name:"04.jpg",w:1920,h:1080},{ name:"05.jpg",w:1620,h:1080},{ name:"06.jpg",w:2400,h:1600},{ name:"07.jpg",w:1620,h:1080}] },
  { slug: "urban-landscape-and-architecture", palette: PALETTES.urbanLandscapeAndArchitecture,
    images: [{ name:"01.jpg",w:2560,h:1440},{ name:"02.jpg",w:1920,h:1280},{ name:"03.jpg",w:1920,h:1280},{ name:"04.jpg",w:1920,h:1280},{ name:"05.jpg",w:1920,h:1280}] },
  { slug: "nature", palette: PALETTES.nature,
    images: [{ name:"01.jpg",w:1600,h:2000},{ name:"02.jpg",w:1920,h:1280},{ name:"03.jpg",w:1280,h:1600},{ name:"04.jpg",w:1920,h:1280},{ name:"05.jpg",w:1600,h:1600}] },
  { slug: "animals-and-wildlife", palette: PALETTES.animalsAndWildlife,
    images: [{ name:"01.jpg",w:2560,h:1707},{ name:"02.jpg",w:1920,h:1280},{ name:"03.jpg",w:1920,h:1280},{ name:"04.jpg",w:1920,h:1280},{ name:"05.jpg",w:1920,h:1280}] },
  { slug: "street", palette: PALETTES.street,
    images: [{ name:"01.jpg",w:1620,h:1080},{ name:"02.jpg",w:1620,h:1080},{ name:"03.jpg",w:1620,h:1080},{ name:"04.jpg",w:1080,h:1620},{ name:"05.jpg",w:1800,h:1200}] },
  { slug: "miscellaneous", palette: PALETTES.miscellaneous,
    images: [{ name:"01.jpg",w:1707,h:2560},{ name:"02.jpg",w:1920,h:1280},{ name:"03.jpg",w:1280,h:1920},{ name:"04.jpg",w:1280,h:1920},{ name:"05.jpg",w:1920,h:1280}] },
  { slug: "astro", palette: PALETTES.astro,
    images: [{ name:"01.jpg",w:2560,h:1440},{ name:"02.jpg",w:1920,h:1280},{ name:"03.jpg",w:1280,h:1600},{ name:"04.jpg",w:1920,h:1280},{ name:"05.jpg",w:2560,h:1440}] },
];

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function generate({ outPath, width, height, palette, seed }) {
  const [c1, c2, c3] = palette;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="55%" stop-color="${c2}"/><stop offset="100%" stop-color="${c3}"/></linearGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="${seed}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.18 0"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" filter="url(#n)" opacity="0.55"/></svg>`;
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile(outPath);
  console.log(`  wrote ${path.relative(ROOT, outPath)}`);
}

let seedCounter = 1;
let skipped = 0;
for (const s of series) {
  console.log(`category ${s.slug}...`);
  for (const img of s.images) {
    const outPath = path.join(ROOT, "public", "images", "series", s.slug, img.name);
    seedCounter++;
    if (await exists(outPath)) { skipped++; continue; }
    await generate({ outPath, width: img.w, height: img.h, palette: s.palette, seed: seedCounter });
  }
}
console.log(`done (${skipped} existing files skipped)`);
