"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface SeriesImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface SeriesData {
  slug: string;
  title: string;
  year: number;
  cover: string;
  images: SeriesImage[];
}

interface Props {
  allSeries: SeriesData[];
  initialHeroSeriesSlug: string;
  initialHeroImageFilename: string;
  initialFeaturedSlugs: string[];
}

export default function HomePageEditor({
  allSeries,
  initialHeroSeriesSlug,
  initialHeroImageFilename,
  initialFeaturedSlugs,
}: Props) {
  const [heroSeriesSlug, setHeroSeriesSlug] = useState(initialHeroSeriesSlug);
  const [heroImageFilename, setHeroImageFilename] = useState(initialHeroImageFilename);

  // Full ordered list of all series slugs (includes hidden ones so they can be re-enabled)
  const [orderedSlugs, setOrderedSlugs] = useState<string[]>(() => {
    const configured = initialFeaturedSlugs.filter((slug) =>
      allSeries.some((s) => s.slug === slug)
    );
    const rest = allSeries
      .map((s) => s.slug)
      .filter((slug) => !configured.includes(slug));
    return [...configured, ...rest];
  });

  // Which slugs are visible on the home page
  const [visibleSlugs, setVisibleSlugs] = useState<Set<string>>(
    () => new Set(initialFeaturedSlugs.filter((slug) => allSeries.some((s) => s.slug === slug)))
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Drag state — use ref to avoid stale closures
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const heroSeries = allSeries.find((s) => s.slug === heroSeriesSlug);
  const heroImages = heroSeries?.images ?? [];

  function toggleVisible(slug: string) {
    setVisibleSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setOrderedSlugs((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    setOrderedSlugs((prev) => {
      if (i >= prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  function onDragStart(i: number) {
    dragIndexRef.current = i;
  }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === i) {
      setDragOverIndex(i);
      return;
    }
    setOrderedSlugs((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(i, 0, moved);
      return next;
    });
    dragIndexRef.current = i;
    setDragOverIndex(i);
  }

  function onDragEnd() {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    const orderedVisible = orderedSlugs.filter((slug) => visibleSlugs.has(slug));
    await fetch("/api/admin/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroSeriesSlug, heroImageFilename, featuredSeriesSlugs: orderedVisible }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-14">

      {/* ── Hero Photo ── */}
      <section>
        <h2 className="font-display text-h2 text-cocoa mb-1">Hero Photo</h2>
        <p className="text-stone text-sm mb-6">The large landscape photo shown directly under the title on the home page.</p>

        <div className="mb-5">
          <label className="text-mono-cap text-stone block mb-2">Series</label>
          <select
            value={heroSeriesSlug}
            onChange={(e) => {
              const slug = e.target.value;
              setHeroSeriesSlug(slug);
              const s = allSeries.find((s) => s.slug === slug);
              setHeroImageFilename(s?.cover ?? s?.images[0]?.src ?? "");
            }}
            className="border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa w-72"
          >
            {allSeries.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
          </select>
        </div>

        {heroImages.length > 0 && (
          <>
            <p className="text-mono-cap text-stone mb-3">Select photo</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {heroImages.map((img) => {
                const selected = heroImageFilename === img.src;
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setHeroImageFilename(img.src)}
                    className={`relative aspect-[3/2] overflow-hidden border-2 transition-all ${
                      selected ? "border-terracotta ring-1 ring-terracotta" : "border-transparent hover:border-sand"
                    }`}
                  >
                    <Image
                      src={`/images/series/${heroSeriesSlug}/${img.src}`}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="120px"
                      unoptimized
                    />
                    {selected && (
                      <div className="absolute inset-0 bg-terracotta/25 flex items-center justify-center">
                        <span className="text-white text-lg font-bold drop-shadow">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* ── Gallery Grid Order ── */}
      <section>
        <h2 className="font-display text-h2 text-cocoa mb-1">Gallery Order</h2>
        <p className="text-stone text-sm mb-6">
          Drag rows or use ↑ ↓ to reorder. Toggle <strong>Shown / Hidden</strong> to control what appears on the home page.
        </p>

        <div className="space-y-1 max-w-2xl">
          {orderedSlugs.map((slug, i) => {
            const s = allSeries.find((x) => x.slug === slug);
            if (!s) return null;
            const coverFile = s.cover || s.images[0]?.src;
            const visible = visibleSlugs.has(slug);
            const isDraggingOver = dragOverIndex === i;

            return (
              <div
                key={slug}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                className={`flex items-center gap-3 px-3 py-2 border transition-all cursor-grab active:cursor-grabbing select-none ${
                  isDraggingOver
                    ? "border-terracotta bg-terracotta/5"
                    : visible
                    ? "border-sand bg-cream-light"
                    : "border-transparent bg-cream-light/50"
                } ${!visible ? "opacity-50" : ""}`}
              >
                {/* Drag handle */}
                <span className="text-stone flex-shrink-0" title="Drag to reorder">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <circle cx="4" cy="3" r="1.2"/><circle cx="10" cy="3" r="1.2"/>
                    <circle cx="4" cy="7" r="1.2"/><circle cx="10" cy="7" r="1.2"/>
                    <circle cx="4" cy="11" r="1.2"/><circle cx="10" cy="11" r="1.2"/>
                  </svg>
                </span>

                {/* Position badge */}
                {visible && (
                  <span className="text-mono-cap text-stone w-5 text-right flex-shrink-0" style={{ fontSize: 10 }}>
                    {[...orderedSlugs].filter((sl) => visibleSlugs.has(sl)).indexOf(slug) + 1}
                  </span>
                )}
                {!visible && <span className="w-5 flex-shrink-0" />}

                {/* Thumbnail */}
                <div className="relative w-14 h-9 overflow-hidden bg-sand flex-shrink-0">
                  {coverFile && (
                    <Image
                      src={`/images/series/${s.slug}/${coverFile}`}
                      alt={s.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized
                    />
                  )}
                </div>

                {/* Title + year */}
                <span className={`flex-1 font-display italic text-sm ${visible ? "text-cocoa" : "text-stone"}`}>
                  {s.title}
                </span>
                <span className="text-mono-cap text-stone flex-shrink-0" style={{ fontSize: 10 }}>{s.year}</span>

                {/* Up / Down */}
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="px-1.5 py-0.5 border border-sand text-stone hover:border-cocoa hover:text-cocoa disabled:opacity-20 transition-colors text-xs"
                    title="Move up"
                  >↑</button>
                  <button
                    type="button"
                    onClick={() => moveDown(i)}
                    disabled={i === orderedSlugs.length - 1}
                    className="px-1.5 py-0.5 border border-sand text-stone hover:border-cocoa hover:text-cocoa disabled:opacity-20 transition-colors text-xs"
                    title="Move down"
                  >↓</button>
                </div>

                {/* Visibility toggle */}
                <button
                  type="button"
                  onClick={() => toggleVisible(slug)}
                  className={`text-mono-cap transition-colors px-2 py-1 border text-xs flex-shrink-0 ${
                    visible
                      ? "border-cocoa text-cocoa hover:border-terracotta hover:text-terracotta"
                      : "border-stone/40 text-stone/60 hover:border-cocoa hover:text-cocoa"
                  }`}
                >
                  {visible ? "Shown" : "Hidden"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Save ── */}
      <div className="flex items-center gap-4 pt-2 border-t border-sand">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-6 px-6 py-2 bg-cocoa text-cream-light font-mono text-sm tracking-widest uppercase hover:bg-terracotta transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span className="mt-6 text-mono-cap text-stone">Saved — reload the home page to see changes.</span>}
      </div>
    </div>
  );
}
