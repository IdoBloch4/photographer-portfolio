import { getAllSeries } from "@/lib/series";
import Link from "next/link";

export default async function AdminSeriesPage() {
  const series = await getAllSeries();

  return (
    <div>
      <h1 className="font-display text-h1 tracking-tight text-cocoa mb-10">
        Photo Series
      </h1>

      <div className="divide-y divide-sand border-y border-sand">
        {series.map((s) => (
          <Link
            key={s.slug}
            href={`/admin/series/${s.slug}`}
            className="group flex items-center justify-between py-5 hover:bg-cream-light px-2 transition-colors"
          >
            <div>
              <p className="font-display italic text-lg text-cocoa group-hover:text-terracotta transition-colors">
                {s.title}
              </p>
              <p className="text-mono-cap text-stone mt-1">
                {s.images.length} photos · {s.year}
                {s.location ? ` · ${s.location}` : ""}
              </p>
            </div>
            <span className="text-mono-cap text-stone group-hover:text-terracotta transition-colors">
              Edit →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
