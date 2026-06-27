import { Photo } from "./Photo";
import type { Series } from "@/lib/series";

interface SeriesHeroProps {
  series: Series;
}

/**
 * Renders the first image of a series as the page-opening hero. Width is
 * capped so that the image's natural height fits within the viewport minus
 * the sticky nav (~80px) and breathing room — the visitor sees the whole
 * frame on first paint, no scrolling required. Click → fullscreen lightbox
 * preserves the original "see it bigger" behavior.
 *
 * Carries `view-transition-name: cover-{slug}` for the shared-element morph
 * from the home triptych into the detail page.
 */
export async function SeriesHero({ series }: SeriesHeroProps) {
  const hero = series.images[0];
  if (!hero || Array.isArray(hero.src) || Array.isArray(hero.alt)) return null;
  const aspectRatio = hero.width / hero.height;
  return (
    <section
      className="mx-auto pt-4 sm:pt-6"
      style={{
        width: "100%",
        // (100vh - 140px) reserves space for nav + small top/bottom margin.
        // × aspect-ratio gives the width at which the photo's natural height
        // equals the available viewport space.
        maxWidth: `calc((100vh - 140px) * ${aspectRatio})`,
      }}
    >
      <Photo
        seriesSlug={series.slug}
        filename={hero.src}
        alt={hero.alt}
        width={hero.width}
        height={hero.height}
        sizes="(min-width: 1024px) 90vw, 100vw"
        priority
        enableLightbox
        viewTransitionName={`cover-${series.slug}`}
      />
      {hero.caption ? (
        <figcaption className="text-mono-cap mt-3">{hero.caption}</figcaption>
      ) : null}
    </section>
  );
}
