import { FullBleed } from "./layouts/FullBleed";
import { Single } from "./layouts/Single";
import { Pair } from "./layouts/Pair";
import { Triptych } from "./layouts/Triptych";
import type { Series, SeriesImage } from "@/lib/series";
import { FadeUpOnView } from "@/components/motion/FadeUpOnView";

interface SeriesFlowProps {
  series: Series;
  /** Index in series.images to start rendering from (default 0). Use `from={1}`
   *  to skip the hero when SeriesHero is rendering it separately above. */
  from?: number;
}

/**
 * Renders images in a series starting at `from`, picking the correct layout
 * primitive per image. Each image is wrapped in FadeUpOnView for the
 * scroll-into-view entrance animation. The hero (index 0) is excluded when
 * `from > 0` because SeriesHero handles it.
 */
export function SeriesFlow({ series, from = 0 }: SeriesFlowProps) {
  const items = series.images.slice(from);
  return (
    <>
      {items.map((image, i) => {
        const realIndex = i + from;
        const isHero = realIndex === 0;
        const node = renderLayout(
          series.slug,
          image,
          isHero,
          isHero ? `cover-${series.slug}` : undefined
        );
        if (isHero) return <div key={realIndex}>{node}</div>;
        return (
          <FadeUpOnView key={realIndex} delayMs={i * 30}>
            {node}
          </FadeUpOnView>
        );
      })}
    </>
  );
}

function renderLayout(
  seriesSlug: string,
  image: SeriesImage,
  priority: boolean,
  viewTransitionName?: string
) {
  switch (image.layout) {
    case "full-bleed":
      return (
        <FullBleed
          seriesSlug={seriesSlug}
          image={image}
          priority={priority}
          viewTransitionName={viewTransitionName}
        />
      );
    case "single":
      return (
        <Single
          seriesSlug={seriesSlug}
          image={image}
          priority={priority}
          viewTransitionName={viewTransitionName}
        />
      );
    case "pair":
      return <Pair seriesSlug={seriesSlug} image={image} />;
    case "triptych":
      return <Triptych seriesSlug={seriesSlug} image={image} />;
  }
}
