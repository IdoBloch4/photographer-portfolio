import { Photo } from "../Photo";
import type { SeriesImage } from "@/lib/series";

interface SingleProps {
  seriesSlug: string;
  image: SeriesImage;
  priority?: boolean;
  viewTransitionName?: string;
}

/**
 * Centered, medium-sized photo with whitespace breathing room on either side.
 * Aspect ratio is preserved by the image's intrinsic dimensions.
 */
export function Single({
  seriesSlug,
  image,
  priority,
  viewTransitionName,
}: SingleProps) {
  if (Array.isArray(image.src) || Array.isArray(image.alt)) {
    throw new Error("Single expects a single src/alt, not an array");
  }
  return (
    <section className="my-16 sm:my-24 mx-auto max-w-4xl">
      <Photo
        seriesSlug={seriesSlug}
        filename={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 1024px) 60vw, 90vw"
        priority={priority}
        enableLightbox
        viewTransitionName={viewTransitionName}
      />
      {image.caption ? (
        <figcaption className="text-mono-cap mt-3">{image.caption}</figcaption>
      ) : null}
    </section>
  );
}
