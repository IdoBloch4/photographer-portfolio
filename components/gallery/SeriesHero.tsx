import { Photo } from "./Photo";
import type { Series } from "@/lib/series";

interface SeriesHeroProps {
  series: Series;
}

export async function SeriesHero({ series }: SeriesHeroProps) {
  const hero = series.images[0];
  if (!hero || Array.isArray(hero.src) || Array.isArray(hero.alt)) return null;
  const aspectRatio = hero.width / hero.height;

  return (
    <section
      // text-center so the inline-block figure centres inside the section
      className="mx-auto pt-4 sm:pt-6 text-center"
      style={{
        // Keep landscape images from being wider than the viewport
        maxWidth: `calc((100svh - 140px) * ${aspectRatio})`,
      }}
    >
      {/*
       * figure is inline-block so it shrink-wraps to the actual rendered
       * image dimensions — no cream sidebars when the photo is portrait or
       * constrained by max-height.
       *
       * !w-auto lets width scale down proportionally when max-height kicks in.
       * [max-height:calc(100svh-120px)] is the viewport cap (svh = small
       * viewport height, safe on mobile where the address bar shrinks space).
       *
       * No overflow:hidden / cropping — the full photo is always visible.
       */}
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
        className="inline-block text-left"
        imgClassName="!w-auto !max-w-full [max-height:calc(100svh-120px)]"
      />
      {hero.caption ? (
        <figcaption className="text-mono-cap mt-3 text-left">{hero.caption}</figcaption>
      ) : null}
    </section>
  );
}
