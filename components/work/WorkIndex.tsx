import { Link } from "next-view-transitions";
import Image from "next/image";
import { imageSrc, type Series } from "@/lib/series";
import { getBlurDataURL } from "@/lib/images";

interface WorkIndexProps {
  series: Series[];
}

/**
 * Vertical stack of large series titles — the anchor for the cursor-follow
 * preview ("wow moment 1"). The hover behavior is added in a sibling client
 * component (CursorImagePreview) in Phase 5; this server component just
 * renders the list semantics.
 */
export async function WorkIndex({ series }: WorkIndexProps) {
  // Pre-resolve blurDataURLs so the client preview renders without flash.
  const previews = await Promise.all(
    series.map(async (s) => {
      const path = imageSrc(s.slug, s.cover);
      const cover = s.images.find((img) => img.src === s.cover) ?? s.images[0];
      return {
        slug: s.slug,
        path,
        blur: await getBlurDataURL(path),
        width: cover.width,
        height: cover.height,
      };
    })
  );

  return (
    <ul className="border-t border-sand">
      {series.map((s, i) => {
        const preview = previews[i];
        return (
          <li key={s.slug} className="border-b border-sand">
            <Link
              href={`/work/${s.slug}`}
              data-series-slug={s.slug}
              data-series-cover={preview.path}
              data-series-blur={preview.blur ?? ""}
              data-series-w={preview.width}
              data-series-h={preview.height}
              className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-8 py-8 sm:py-10 transition-colors duration-200 hover:text-terracotta"
            >
              <div className="flex items-center gap-6">
                {/* Mobile thumbnail — desktop uses cursor-follow preview instead */}
                <div className="sm:hidden relative w-16 h-16 shrink-0 overflow-hidden bg-cream-deep">
                  <Image
                    src={preview.path}
                    alt=""
                    fill
                    sizes="64px"
                    placeholder={preview.blur ? "blur" : "empty"}
                    blurDataURL={preview.blur ?? undefined}
                    className="object-cover"
                    aria-hidden="true"
                  />
                </div>
                <h2
                  className="font-display text-4xl sm:text-6xl tracking-tight transition-colors duration-200"
                  style={{ fontVariationSettings: '"SOFT" 60, "opsz" 96' }}
                >
                  {s.title}
                </h2>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 text-mono-cap">
                {s.tags.slice(0, 2).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
                <span>{s.year}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
