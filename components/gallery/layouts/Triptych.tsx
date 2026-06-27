import { Photo } from "../Photo";
import type { SeriesImage } from "@/lib/series";

interface TriptychProps {
  seriesSlug: string;
  image: SeriesImage;
}

/** Three photos in a row on desktop, stacked on mobile. */
export function Triptych({ seriesSlug, image }: TriptychProps) {
  if (!Array.isArray(image.src) || !Array.isArray(image.alt)) {
    throw new Error("Triptych expects array src/alt");
  }
  if (image.src.length !== 3) {
    throw new Error("Triptych expects exactly 3 images");
  }

  return (
    <section className="my-16 sm:my-24 mx-auto max-w-6xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {image.src.map((filename, i) => (
          <Photo
            key={filename}
            seriesSlug={seriesSlug}
            filename={filename}
            alt={image.alt[i]}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 30vw, 90vw"
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
