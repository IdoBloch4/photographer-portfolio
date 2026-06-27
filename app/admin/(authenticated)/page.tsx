// AUTH_DISABLED: restore auth import and session display once Google OAuth is configured
// import { auth } from "@/auth";
import { getAllSeries } from "@/lib/series";
import Link from "next/link";

export default async function AdminDashboard() {
  const series = await getAllSeries();

  return (
    <div>
      <h1 className="font-display text-h1 tracking-tight text-cocoa mb-2">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/series"
          className="group block border border-sand bg-cream-light p-8 hover:border-terracotta transition-colors duration-200"
        >
          <p className="text-mono-cap text-stone mb-3">Manage</p>
          <h2 className="font-display text-h2 text-cocoa group-hover:text-terracotta transition-colors">
            Photo Series
          </h2>
          <p className="mt-3 text-stone text-sm leading-relaxed">
            {series.length} series · Add, remove, and reorder photos
          </p>
        </Link>

        <Link
          href="/admin/content"
          className="group block border border-sand bg-cream-light p-8 hover:border-terracotta transition-colors duration-200"
        >
          <p className="text-mono-cap text-stone mb-3">Edit</p>
          <h2 className="font-display text-h2 text-cocoa group-hover:text-terracotta transition-colors">
            Site Content
          </h2>
          <p className="mt-3 text-stone text-sm leading-relaxed">
            Behind the Lens bio, home page quote, contact page text
          </p>
        </Link>
      </div>
    </div>
  );
}
