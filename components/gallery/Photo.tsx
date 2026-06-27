import Image from "next/image";
import { getBlurDataURL } from "@/lib/images";
import { imageSrc } from "@/lib/series";

interface PhotoProps {
  /** Series slug — combines with filename to resolve `/images/series/{slug}/{file}` */
  seriesSlug: string;
  /** Image filename, e.g. "01.jpg" */
  filename: string;
  alt: string;
  /** Intrinsic width of the source image, in pixels */
  width: number;
  /** Intrinsic height of the source image, in pixels */
  height: number;
  /** Hint for next/image's `sizes` attr (e.g. "100vw", "(min-width: 1024px) 50vw, 100vw") */
  sizes?: string;
  /** True for above-the-fold images that should not be lazy-loaded */
  priority?: boolean;
  className?: string;
  /** Optional view-transition-name for shared-element transitions */
  viewTransitionName?: string;
  /** When true, an invisible overlay button is rendered. The SeriesLightbox
   *  client component listens for clicks on `[data-lightbox-src]` and opens
   *  at the matching image index. */
  enableLightbox?: boolean;
}

/**
 * Server component that renders a next/image with a build-time LQIP and a
 * subtle film-grain overlay. Use the layout primitives in ./layouts to position
 * Photos within a series flow.
 */
export async function Photo({
  seriesSlug,
  filename,
  alt,
  width,
  height,
  sizes = "100vw",
  priority,
  className,
  viewTransitionName,
  enableLightbox,
}: PhotoProps) {
  const src = imageSrc(seriesSlug, filename);
  const blurDataURL = await getBlurDataURL(src);

  return (
    <figure
      className={`grain relative overflow-hidden bg-cream-deep ${enableLightbox ? "cursor-zoom-in" : ""} ${className ?? ""}`}
      style={
        viewTransitionName
          ? ({ viewTransitionName } as React.CSSProperties)
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL ?? undefined}
        quality={88}
        className="block w-full h-auto select-none"
        draggable={false}
      />
      {enableLightbox ? (
        <button
          type="button"
          data-lightbox-src={src}
          aria-label={`View "${alt}" larger`}
          className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:-outline-offset-2"
        />
      ) : null}
    </figure>
  );
}
