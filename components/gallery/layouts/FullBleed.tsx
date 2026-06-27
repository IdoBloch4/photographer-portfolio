import { Photo } from "../Photo";
import type { SeriesImage } from "@/lib/series";

interface FullBleedProps {
  seriesSlug: string;
  image: SeriesImage;
  priority?: boolean;
  viewTransitionName?: string;
}

/**
 * Hero / showcase photo. Constrains the photo so it fits within ~85% of the
 * viewport height — on a wide desktop a 3:2 photo at literal 100vw is taller
 * than the screen, forcing the visitor to scroll to see the full frame. The
 * actual rendered width is `min(100% of parent, 85vh × aspect-ratio)`, so on
 * mobile the photo fills the column and on desktop it sits centered with
 * cream margins. Click → fullscreen lightbox preserves the original "see it
 * all" behavior.
 */
export function FullBleed({
  seriesSlug,
  image,
  priority,
  viewTransitionName,
}: FullBleedProps) {
  if (Array.isArray(image.src) || Array.isArray(image.alt)) {
    throw new Error("FullBleed expects a single src/alt, not an array");
  }
  const aspectRatio = image.width / image.height;
  return (
    <section
      className="my-12 sm:my-20 mx-auto"
      style={{
        width: "100%",
        // 85vh × aspect-ratio gives the width at which the photo's natural
        // height would equal 85% of the viewport. Past that, the parent
        // container's max-w-[1440px] still applies as an upper bound.
        maxWidth: `calc(85vh * ${aspectRatio})`,
      }}
    >
      <Photo
        seriesSlug={seriesSlug}
        filename={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 1024px) 90vw, 100vw"
        priority={priority}
        enableLightbox
        viewTransitionName={viewTransitionName}
      />
      {image.caption ? (
        <figcaption className="text-mono-cap mt-3">
          {image.caption}
        </figcaption>
      ) : null}
    </section>
  );
}
