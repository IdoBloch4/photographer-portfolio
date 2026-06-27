import { Photo } from "../Photo";
import type { SeriesImage } from "@/lib/series";

interface PairProps {
  seriesSlug: string;
  image: SeriesImage;
}

/** Two photos side-by-side on desktop, stacked on mobile. */
export function Pair({ seriesSlug, image }: PairProps) {
  if (!Array.isArray(image.src) || !Array.isArray(image.alt)) {
    throw new Error("Pair expects array src/alt");
  }
  if (image.src.length !== 2) {
    throw new Error("Pair expects exactly 2 images");
  }

  return (
    <section className="my-16 sm:my-24 mx-auto max-w-5xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {image.src.map((filename, i) => (
          <Photo
            key={filename}
            seriesSlug={seriesSlug}
            filename={filename}
            alt={image.alt[i]}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 40vw, 90vw"
            enableLightbox
          />
        ))}
      </div>
      {image.caption ? (
        <figcaption className="text-mono-cap mt-3">{image.caption}</figcaption>
      ) : null}
    </section>
  );
}
