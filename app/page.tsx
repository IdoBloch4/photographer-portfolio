import Link from "next/link";
import { Link as VTLink } from "next-view-transitions";
import { getAllSeries } from "@/lib/series";
import { getSiteContent } from "@/lib/site-content";
import { Photo } from "@/components/gallery/Photo";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [series, siteContent] = await Promise.all([
    getAllSeries(),
    getSiteContent(),
  ]);
  // Curated triptych — first image of the first three series.
  const triptych = series.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-[1440px] px-6 sm:px-10 pt-10 sm:pt-14 pb-12 sm:pb-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 lg:items-end">
          <div className="col-span-12 lg:col-span-7">
            <p className="text-mono-cap mb-4 sm:mb-6">
              Photographer
              {series.map((s) => (
                <span key={s.slug}>
                  {" · "}
                  <Link
                    href={`/work/${s.slug}`}
                    className="link-underline hover:text-terracotta"
                  >
                    {s.title}
                  </Link>
                </span>
              ))}
            </p>
            <h1
              className="font-display text-display tracking-tight text-cocoa"
              style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144' }}
            >
              {site.name}
            </h1>
          </div>
          <div className="col-span-12 lg:col-span-5 mt-4 lg:mt-0">
            <p className="font-display text-h2 italic text-stone max-w-md leading-snug">
              {siteContent.home.tagline.split("\\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* Curated triptych */}
      {triptych.length > 0 ? (
        <section className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <div className="grid grid-cols-12 gap-6 sm:gap-8">
            {triptych.map((s, i) => {
              const colClasses = [
                "col-span-12 lg:col-span-5",
                "col-span-12 sm:col-span-6 lg:col-span-4",
                "col-span-12 sm:col-span-6 lg:col-span-3",
              ];
              const cover = s.images.find((img) => img.src === s.cover) ?? s.images[0];
              const filename = Array.isArray(cover.src) ? cover.src[0] : cover.src;
              const alt = Array.isArray(cover.alt) ? cover.alt[0] : cover.alt;
              return (
                <VTLink
                  key={s.slug}
                  href={`/work/${s.slug}`}
                  className={`group ${colClasses[i]}`}
                >
                  <Photo
                    seriesSlug={s.slug}
                    filename={filename}
                    alt={alt}
                    width={cover.width}
                    height={cover.height}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    priority={i === 0}
                    viewTransitionName={`cover-${s.slug}`}
                  />
                  <div className="mt-3 flex items-baseline justify-between">
                    <p className="font-display italic text-lg text-cocoa group-hover:text-terracotta transition-colors duration-200">
                      {s.title}
                    </p>
                    <p className="text-mono-cap">{s.year}</p>
                  </div>
                </VTLink>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Statement */}
      <section className="mx-auto max-w-2xl px-6 sm:px-10 py-20 sm:py-28 text-center">
        <p className="font-display italic text-h2 text-cocoa leading-snug">
          &ldquo;{siteContent.home.quote}&rdquo;
        </p>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-[1440px] px-6 sm:px-10 pb-16">
        <div className="border-t border-sand pt-10">
          <Link
            href="/work"
            className="link-underline font-display text-2xl sm:text-3xl text-terracotta"
          >
            View all series &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
