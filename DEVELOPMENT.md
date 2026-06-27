# Sarit Carmon Photography — Development Context

This document exists so development can continue in a different session, tool,
or by a different person without re-deriving decisions already made. If you're
an AI assistant reading this cold: read this whole file before changing
architecture, the design system, or content structure.

## What this is

A portfolio website for Sarit Carmon, a fine-art photographer. It's a gallery
for her body of work, not a client-booking site — no pricing, no booking
forms. Organized by **photo genre** (Landscape / Street / Macro / Astro /
Abstract), not by location or chronology. Built with Next.js 16 App Router,
fully statically generated, no database, no CMS.

Design concept name: **"Quiet Earth"** — warm cream canvas, deep cocoa ink,
terracotta accent. The intent is an editorial monograph feel: the photographs
are loud, everything else is quiet. Two restrained motion moments (see
below), otherwise minimal animation.

## ⚠️ Next.js version warning

This project runs **Next.js 16.2.6**, newer than most AI training data. The
repo's own `AGENTS.md` (auto-loaded into context by Claude Code) says:

> This version has breaking changes — APIs, conventions, and file structure
> may all differ from your training data. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing any code.

Concretely relevant in this codebase: `params` in dynamic route pages is a
`Promise` that must be `await`-ed (see `app/work/[series]/page.tsx`) — don't
"fix" this back to a plain object. Before assuming any App Router API works
the way it did in Next 13/14 training data, check `node_modules/next/dist/docs/`
or the live docs for 16.x.

## Tech stack

| Package | Why |
|---|---|
| `next` 16.2.6 | App Router, Turbopack, static export of every route |
| `react` / `react-dom` 19.2 | — |
| `tailwindcss` v4 | CSS-first config — no `tailwind.config.js`, all tokens live in `app/globals.css` under `@theme` |
| `motion` 12.x | Formerly "Framer Motion" — package renamed. Used only for the cursor-spring math that's currently unused (see below) |
| `next-view-transitions` | Wraps the native View Transitions API for App Router navigation |
| `yet-another-react-lightbox` | Fullscreen photo viewer, dynamically imported |
| `plaiceholder` + `sharp` | Build-time blur-up placeholder (LQIP) generation |

No test suite exists. No analytics. No backend — every page is a server
component reading JSON + images from the filesystem at build time.

## Design system reference

All tokens live in `app/globals.css` under `@theme` (Tailwind v4 CSS-first
config — there is no separate config file).

**Colors:**
```
--color-cream        #F5F0E1   primary canvas
--color-cream-light   #FBF7EC   hovered cards / lightbox chrome
--color-cream-deep    #ECE2CC   footer / section dividers
--color-cocoa         #2A1F18   primary text (~13.5:1 contrast on cream)
--color-stone         #6B5B47   secondary text (~5.2:1)
--color-stone-subtle  #9C8A72   tertiary, large text only
--color-terracotta     #C67B5C   accent — links, hover, focus ring
--color-terracotta-deep #9B5C3F  active/pressed
--color-olive          #6B7B3C   rare emphasis (not heavily used yet)
--color-sand           #E5DBC8   borders
--color-sand-strong    #CFC1A4   stronger borders
```

**Typography:** Fraunces (display/serif, variable font, axes `SOFT` + `opsz` —
dialed up for bold editorial headlines, dialed down for softer body-adjacent
use) + Inter (body/UI sans) + JetBrains Mono (tags, captions, dates — always
uppercase, tracked out via `.text-mono-cap` utility class). Loaded via
`next/font/google` in `lib/fonts.ts`.

**Motion tokens:** `--duration-fast` 200ms, `--duration-base` 400ms,
`--duration-page` 600ms, `--duration-hero` 800ms; `--ease-out-expo` and
`--ease-inout` cubic-beziers. Everything collapses under
`prefers-reduced-motion: reduce` (global `*` rule near the bottom of
`globals.css`).

**Scope decisions already made — don't re-litigate without a reason:**
- **Dark mode**: not built. Out of scope for v1.
- **Hebrew / RTL**: deferred. Not architected. Adding it later means real
  restructuring (locale routing, RTL-aware CSS, a font pairing that supports
  Hebrew), not a quick toggle.
- **Contact**: mailto-only, no form. Fewer moving parts, no spam handling
  needed. This was an explicit choice, not a missing feature.
- **Border radius**: ~0 on photos (sharp, gallery-print feel), 2px max on UI
  chrome. Don't round image corners.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Hero (name + tagline), curated triptych (first 3 categories), one-line artist statement, CTA to `/work` |
| `/work` | `app/work/page.tsx` | List of all 5 categories, large Fraunces type |
| `/work/[series]` | `app/work/[series]/page.tsx` | One category's gallery. `generateStaticParams` pre-renders all 5 at build time |
| `/behind-the-lens` | `app/behind-the-lens/page.tsx` | About / artist statement |
| `/contact` | `app/contact/page.tsx` | Big mailto link, Instagram link |

## Data flow & naming caveat

```
content/series/{slug}.json  →  lib/series.ts  →  page components (async server components)
public/images/series/{slug}/{NN}.jpg  →  components/gallery/Photo.tsx  (via lib/images.ts for blur placeholders)
```

**Naming caveat:** the code calls a category a "Series" everywhere —
`Series` interface, `getAllSeries()`, `content/series/`,
`components/gallery/SeriesHero.tsx`, etc. This is a holdover from an earlier
version of the site that organized work by *trip/location* (the categories
used to be `greece-slow-roads`, `amsterdam-looking-up`, etc. — a `Series` in
the photographic sense, a body of work from one trip). The model was changed
to genre-based categories (Landscape/Street/Macro/Astro/Abstract) per user
feedback, but the code was never renamed. **It's worth a rename pass**
(`Series` → `Category`, `content/series/` → `content/categories/`) before
this grows much further, but wasn't done yet to avoid unnecessary churn
mid-build. If you do it, it's a mechanical rename — no behavior changes.

`lib/series.ts` exports:
- `getAllSeries()` — reads every `content/series/*.json`, sorted by `order`
- `getSeriesBySlug(slug)`
- `flattenSeriesImages(series)` — flattens `pair`/`triptych` array entries
  into one ordered list, used to build the lightbox's slide array (so a
  clicked photo's index lines up exactly)
- `imageSrc(slug, filename)` — builds the public URL

## Image rendering pipeline

- `lib/images.ts` — `getBlurDataURL(path)` reads the file off disk and
  generates a base64 LQIP via `plaiceholder`, cached in a module-level `Map`
  (so repeated calls during one build don't re-read the same file).
- `components/gallery/Photo.tsx` — the **only** place `next/image` is called
  for series photos. Handles the blur placeholder, the film-grain overlay
  (`.grain` CSS class — animated noise via inline SVG `feTurbulence`, 4%
  opacity, `mix-blend-mode: multiply`), and optionally renders an invisible
  full-cover `<button data-lightbox-src="...">` for click-to-zoom.
- Layout primitives, `components/gallery/layouts/`:
  - `FullBleed` — showcase width, capped height (`~85vh`) so it's never
    taller than the viewport
  - `Single` — centered, medium, generous margins (the default/workhorse)
  - `Pair` — 2-up, side by side on desktop, stacked on mobile
  - `Triptych` — 3-up, rare, only for genuinely related sets
- `components/gallery/SeriesHero.tsx` — renders a category's **first** image
  (`images[0]`) specially. Width is capped via
  `calc((100vh - 140px) * aspectRatio)` so the entire photo is visible on
  first paint without scrolling, on any screen size. This was a deliberate
  fix after the original full-bleed-100vw hero forced scrolling on wide
  monitors — don't revert to plain full-bleed for the hero.
- `components/gallery/SeriesFlow.tsx` — renders the rest (`images[1..]`)
  through the matching layout primitive, each wrapped in
  `components/motion/FadeUpOnView.tsx` for a scroll-triggered fade-up
  (Intersection Observer, fires once, respects reduced-motion).
- `components/gallery/SeriesLightbox.tsx` — `next/dynamic`-imported
  (`ssr: false`) wrapper around `yet-another-react-lightbox`. Listens for
  clicks on **any** `[data-lightbox-src]` element via one document-level
  delegated listener — this lets the photo grid stay server-rendered without
  each thumbnail needing to be a client component.

## The shared-element page transition ("wow moment")

- Root layout wraps everything in `<ViewTransitions>` from
  `next-view-transitions`. Internal links use that package's `Link`
  (sometimes aliased `VTLink` in files that also import plain `next/link`
  for non-transitioning links).
- Each category's cover photo carries an inline
  `style={{ viewTransitionName: 'cover-{slug}' }}` — **must** stay inline
  style, not a CSS class, because the value needs to be unique per element
  and Tailwind/CSS classes can't template a slug into a property value.
- Click a cover (currently: the home page triptych) → it morphs into the
  `SeriesHero` on the destination page.
- Timing lives in `globals.css`: `::view-transition-old(*)` /
  `::view-transition-new(*)`, 500ms, `ease-inout`. It's a single
  document-wide rule, not per-element, because `::view-transition-*`
  pseudo-elements don't support attribute selectors (can't target
  `cover-landscape` specifically in CSS) — this is a browser limitation, not
  a bug in this code.
- Reduced-motion collapses this to 100ms.

## Removed: cursor-follow image preview

An earlier second "wow moment" — a small floating image that followed the
cursor when hovering category titles on `/work` — was built
(`components/motion/CursorImagePreview.tsx`, uses `motion`'s `useSpring`)
but was **explicitly removed** after the user said "I don't want it." The
file still exists but is not imported or rendered anywhere. **Don't
re-introduce it without checking with the user first** — this was a direct,
unambiguous rejection, not an oversight.

## Single source of truth for site content

`lib/site.ts` exports `site` (name, tagline, description, url, email,
instagram, copyrightStart) and `navLinks`. Every page/component reads from
here. **Never hardcode the email, Instagram URL, or site name anywhere
else** — that's exactly the bug this file exists to prevent.

Current values:
```ts
name: "Sarit Carmon"
email: "tirasc@gmail.com"
instagram: "https://www.instagram.com/saritcarmon/"
url: "https://saritcarmon.com"   // placeholder — domain not registered/deployed yet
```

Note: the home page tagline ("Photographer · Landscape · Street · Macro ·
Astro · Abstract") is **not** rendered from `site.tagline` as plain text —
`app/page.tsx` builds it by mapping over the live category list from
`getAllSeries()`, so each genre name is a real `<Link href="/work/{slug}">`.
`site.tagline` itself is now an unused string (kept for potential reuse in
`<meta>` description, not currently referenced in JSX).

## Icons

No icon library. `components/ui/Icons.tsx` has two hand-drawn inline SVGs
(`MailIcon`, `InstagramIcon`) — `stroke="currentColor"`, sized in `em` units
so they scale with whatever text surrounds them, `aria-hidden="true"` since
the adjacent link text already conveys the destination. This matches the
pre-existing convention in `components/layout/Nav.tsx` (the mobile hamburger
icon is also inline SVG). If more icons are needed, follow this pattern
rather than adding a dependency for a handful of glyphs.

## Build & dev

```
npm run dev      # Turbopack dev server, port 3000 (auto-falls-back if busy)
npm run build    # production build — every route is static or SSG
npm run lint      # eslint
```

`.claude/launch.json` (at the user's home directory level, not in this repo)
configures Claude Code's preview tooling — irrelevant in any other
tool/editor; just run `npm run dev`.

**Known gotcha:** running `npm run build` and then `npm run dev` without
clearing `.next/` first has produced stale-cache 404s on routes that
definitely exist (Turbopack cache issue). If you see a 404 on a route with a
real `page.tsx`, delete `.next/` and restart the dev server before debugging
further.

## What's NOT done yet

- **Real photos**: only Landscape (5 of 7 image slots) and Street (2 of 5)
  have real photographs. Macro, Astro, and Abstract are 100% placeholder
  gradients. See `IMAGE_PREP.md` for the full plan on closing this gap.
- No OG image file at the referenced `/og.jpg` path (metadata points to it,
  file doesn't exist).
- No `sitemap.xml` / `robots.txt`.
- No analytics.
- Not deployed anywhere — no Vercel project, no DNS, domain is a placeholder.
- No real portrait photo on `/behind-the-lens` (currently a gradient with a
  "Portrait — to be added" label).
- No git remote configured as of this writing (check `git remote -v` —
  don't assume).

## File reference map

| File | Role |
|---|---|
| `app/layout.tsx` | Root layout — fonts, `<ViewTransitions>`, `<Nav>`/`<Footer>` |
| `app/globals.css` | All design tokens (`@theme`), base styles, grain overlay, view-transition timing |
| `lib/fonts.ts` | next/font Google Fonts setup |
| `lib/site.ts` | Site-wide content strings — **the** source of truth |
| `lib/series.ts` | Category data loading/typing (see naming caveat above) |
| `lib/images.ts` | Blur placeholder (LQIP) generation |
| `components/layout/Nav.tsx` / `Footer.tsx` | Site chrome |
| `components/gallery/Photo.tsx` | The one place `next/image` is used for content photos |
| `components/gallery/layouts/*.tsx` | FullBleed / Single / Pair / Triptych |
| `components/gallery/SeriesHero.tsx` | First-image-of-category special handling |
| `components/gallery/SeriesFlow.tsx` | Renders the rest of a category |
| `components/gallery/SeriesLightbox.tsx` | Fullscreen viewer (dynamic import) |
| `components/motion/FadeUpOnView.tsx` | Scroll-triggered entrance animation |
| `components/motion/CursorImagePreview.tsx` | **Unused** — see "Removed" section above |
| `components/ui/Icons.tsx` | Inline SVG icons |
| `content/series/*.json` | The 5 category data files |
| `scripts/import-photos.mjs` | Copies/processes real photos from Sarit's export folder into `public/images/series/` |
| `scripts/generate-placeholders.mjs` | Generates gradient placeholder JPGs for empty slots (idempotent — skips existing files) |
