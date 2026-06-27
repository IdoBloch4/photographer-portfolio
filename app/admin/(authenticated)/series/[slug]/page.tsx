import { getSeriesBySlug, getAllSeries } from "@/lib/series";
import { notFound } from "next/navigation";
import { SeriesPhotoManager } from "./SeriesPhotoManager";

export async function generateStaticParams() {
  const series = await getAllSeries();
  return series.map((s) => ({ slug: s.slug }));
}

export default async function AdminSeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);
  if (!series) notFound();

  return (
    <div>
      <div className="mb-8">
        <p className="text-mono-cap text-stone mb-1">Series</p>
        <h1 className="font-display text-h1 tracking-tight text-cocoa">
          {series.title}
        </h1>
        <p className="text-mono-cap text-stone mt-2">
          {series.images.length} photos
        </p>
      </div>
      <SeriesPhotoManager series={series} />
    </div>
  );
}
