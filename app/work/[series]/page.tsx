import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSeries, getSeriesBySlug, flattenSeriesImages } from "@/lib/series";
import { SeriesHero } from "@/components/gallery/SeriesHero";
import { SeriesFlow } from "@/components/gallery/SeriesFlow";
import { SeriesLightbox } from "@/components/gallery/SeriesLightbox";

interface SeriesPageProps {
  params: Promise<{ series: string }>;
}

export async function generateStaticParams() {
  const all = await getAllSeries();
  return all.map((s) => ({ series: s.slug }));
}

export async function generateMetadata({
  params,
}: SeriesPageProps): Promise<Metadata> {
  const { series: slug } = await params;
  const s = await getSeriesBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.description,
  };
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const { series: slug } = await params;
  const s = await getSeriesBySlug(slug);
  if (!s) notFound();

  const all = await getAllSeries();
  const idx = all.findIndex((x) => x.slug === slug);
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <article>
      {/* Hero — first image, sized to fit within the viewport so the visitor
          sees the whole frame on first paint. Click → fullscreen lightbox. */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <SeriesHero series={s} />
      </div>

      {/* Title block — appears below the hero so the photo gets the welcome */}
      <header className="mx-auto max-w-[1440px] px-6 sm:px-10 pt-12 sm:pt-16 pb-4">
        <p className="text-mono-cap mb-4">
          {s.tags.join(" · ")} · {s.year}
          {s.location ? ` · ${s.location}` : ""}
        </p>
        <h1
          className="font-display text-h1 tracking-tight text-cocoa max-w-3xl"
          style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144' }}
        >
          {s.title}
        </h1>
        <p className="mt-6 text-lg text-stone max-w-2xl leading-relaxed">
          {s.description}
        </p>
      </header>

      {/* Rest of the gallery — images 2..n */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
        <SeriesFlow series={s} from={1} />
      </div>
      <SeriesLightbox images={flattenSeriesImages(s)} />

      <footer className="mx-auto max-w-[1440px] px-6 sm:px-10 mt-24 mb-20 border-t border-sand pt-10 flex items-baseline justify-between">
        <Link href="/work" className="link-underline text-cocoa hover:text-terracotta">
          ← All series
        </Link>
        {next ? (
          <Link
            href={`/work/${next.slug}`}
            className="link-underline font-display text-xl sm:text-2xl text-terracotta text-right"
          >
            Next: {next.title} →
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
