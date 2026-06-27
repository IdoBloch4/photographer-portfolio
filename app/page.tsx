import Link from "next/link";
import { Link as VTLink } from "next-view-transitions";
import { getAllSeries } from "@/lib/series";
import { getSiteContent } from "@/lib/site-content";
import { Photo } from "@/components/gallery/Photo";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [allSeries, siteContent] = await Promise.all([
    getAllSeries(),
    getSiteContent(),
  ]);

  const { heroSeriesSlug, heroImageFilename, featuredSeriesSlugs } = siteContent.home;

  // Hero photo
  const heroSeries = allSeries.find((s) => s.slug === heroSeriesSlug);
  const heroCover = heroSeries
    ? (heroSeries.images.find((img) => {
        const src = Array.isArray(img.src) ? img.src[0] : img.src;
        return src === heroImageFilename;
      }) ?? heroSeries.images[0])
    : null;
  const heroFilename = heroCover
    ? (Array.isArray(heroCover.src) ? heroCover.src[0] : heroCover.src)
    : null;
  const heroAlt = heroCover
    ? (Array.isArray(heroCover.alt) ? heroCover.alt[0] : heroCover.alt)
    : "";

  // Featured series in configured order, filtered to only those with images
  const seriesMap = new Map(allSeries.map((s) => [s.slug, s]));
  const featuredSeries = featuredSeriesSlugs
    .map((slug) => seriesMap.get(slug))
    .filter((s): s is NonNullable<typeof s> => !!s && s.images.length > 0);

  return (
    <div>
      {/* Hero — name + tagline */}
      <section className="mx-auto max-w-[1440px] px-6 sm:px-10 pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 lg:items-end">
          <div className="col-span-12 lg:col-span-7">
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

      {/* Hero landscape photo */}
      {heroCover && heroFilename && heroSeries && (
        <section className="mx-auto max-w-[1440px] px-6 sm:px-10 pb-16 sm:pb-20">
          <VTLink href={`/work/${heroSeries.slug}`} className="block" style={{ maxHeight: "70vh", overflow: "hidden" }}>
            <Photo
              seriesSlug={heroSeries.slug}
              filename={heroFilename}
              alt={heroAlt}
              width={heroCover.width}
              height={heroCover.height}
              sizes="100vw"
              priority
            />
          </VTLink>
        </section>
      )}

      {/* Series gallery grid */}
      {featuredSeries.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-6 sm:px-10 pb-16 sm:pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredSeries.map((s) => {
              const cover = s.images.find((img) => img.src === s.cover) ?? s.images[0];
              const filename = Array.isArray(cover.src) ? cover.src[0] : cover.src;
              const alt = Array.isArray(cover.alt) ? cover.alt[0] : cover.alt;
              return (
                <VTLink key={s.slug} href={`/work/${s.slug}`} className="group">
                  <div className="overflow-hidden aspect-[4/3] bg-sand">
                    <Photo
                      seriesSlug={s.slug}
                      filename={filename}
                      alt={alt}
                      width={cover.width}
                      height={cover.height}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      viewTransitionName={`cover-${s.slug}`}
                    />
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <p className="font-display italic text-base text-cocoa group-hover:text-terracotta transition-colors duration-200">
                      {s.title}
                    </p>
                    <p className="text-mono-cap text-xs">{s.year}</p>
                  </div>
                </VTLink>
              );
            })}
          </div>
        </section>
      )}

      {/* Statement quote */}
      <section className="mx-auto max-w-2xl px-6 sm:px-10 py-16 sm:py-24 text-center">
        <p className="font-display italic text-h2 text-cocoa leading-snug">
          &ldquo;{siteContent.home.quote}&rdquo;
        </p>
      </section>

      {/* CTA strip */}
      <section className="mx-auto max-w-[1440px] px-6 sm:px-10 pb-16">
        <div className="border-t border-sand pt-10">
          <Link href="/work" className="link-underline font-display text-2xl sm:text-3xl text-terracotta">
            View all series &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
