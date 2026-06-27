"use client";

import { useState, useRef } from "react";
import type { Series, SeriesImage, SeriesImageLayout } from "@/lib/series";
import Image from "next/image";

const LAYOUTS: SeriesImageLayout[] = ["single", "full-bleed", "pair", "triptych"];
const LAYOUT_LABELS: Record<SeriesImageLayout, string> = {
  single: "Single",
  "full-bleed": "Full Bleed",
  pair: "Pair (2 photos)",
  triptych: "Triptych (3 photos)",
};
const MULTI_LAYOUTS: SeriesImageLayout[] = ["pair", "triptych"];
const LAYOUT_COUNT: Record<SeriesImageLayout, number> = {
  single: 1,
  "full-bleed": 1,
  pair: 2,
  triptych: 3,
};

interface Props {
  series: Series;
}

export function SeriesPhotoManager({ series }: Props) {
  const [images, setImages] = useState<SeriesImage[]>(series.images);
  const [cover, setCover] = useState(series.cover);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadLayout, setUploadLayout] = useState<SeriesImageLayout>("single");
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag-to-reorder state
  const dragIndex = useRef<number | null>(null);

  function onDragStart(i: number) {
    dragIndex.current = i;
  }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === i) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(i, 0, moved);
    dragIndex.current = i;
    setImages(next);
  }

  function onDragEnd() {
    dragIndex.current = null;
  }

  function removeImage(i: number) {
    if (!confirm("Remove this photo entry?")) return;
    const next = [...images];
    const removed = next.splice(i, 1)[0];
    setImages(next);
    // If the removed entry was the cover, clear it
    const removedSrc = Array.isArray(removed.src) ? removed.src[0] : removed.src;
    if (removedSrc === cover) setCover(next[0] ? String(Array.isArray(next[0].src) ? next[0].src[0] : next[0].src) : "");
  }

  function setCoverImage(img: SeriesImage) {
    const src = Array.isArray(img.src) ? img.src[0] : img.src;
    setCover(src);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFiles || uploadFiles.length === 0) return;
    const needed = LAYOUT_COUNT[uploadLayout];
    if (uploadFiles.length < needed) {
      alert(`This layout needs ${needed} file(s). You selected ${uploadFiles.length}.`);
      return;
    }
    if (!uploadAlt.trim()) {
      alert("Please enter alt text.");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("layout", uploadLayout);
    formData.append("caption", uploadCaption);
    for (let i = 0; i < needed; i++) {
      formData.append("files", uploadFiles[i]);
    }
    // alt text: one per file for pair/triptych
    const altArr = uploadAlt.split("|").map((s) => s.trim());
    while (altArr.length < needed) altArr.push(altArr[0] || "");
    for (const a of altArr.slice(0, needed)) {
      formData.append("alt", a);
    }

    const res = await fetch(`/api/admin/series/${series.slug}/photos`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.text();
      alert(`Upload failed: ${err}`);
      setUploading(false);
      return;
    }
    const { image } = await res.json();
    setImages((prev) => [...prev, image]);
    setUploadFiles(null);
    setUploadAlt("");
    setUploadCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploading(false);
  }

  async function saveOrder() {
    setSaving(true);
    setSaveMsg(null);
    const res = await fetch(`/api/admin/series/${series.slug}/order`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images, cover }),
    });
    if (res.ok) {
      setSaveMsg("Saved!");
    } else {
      setSaveMsg("Error saving. Try again.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(null), 3000);
  }

  async function deletePhoto(i: number, filename: string) {
    if (!confirm(`Delete file "${filename}" from disk? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/series/${series.slug}/photos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    if (!res.ok) {
      alert("Delete failed.");
      return;
    }
    removeImage(i);
  }

  const multiLayout = MULTI_LAYOUTS.includes(uploadLayout);

  return (
    <div>
      {/* Photo list */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-mono-cap text-stone">
          Drag rows to reorder. Click star to set cover.
        </p>
        <div className="flex items-center gap-4">
          {saveMsg && (
            <span className={`text-sm ${saveMsg === "Saved!" ? "text-green-700" : "text-red-600"}`}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={saveOrder}
            disabled={saving}
            className="px-5 py-2 bg-cocoa text-cream-light text-mono-cap hover:bg-terracotta transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Order"}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-12">
        {images.map((img, i) => {
          const srcs = Array.isArray(img.src) ? img.src : [img.src];
          const alts = Array.isArray(img.alt) ? img.alt : [img.alt];
          const isCover = srcs[0] === cover;
          return (
            <div
              key={i}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDragEnd={onDragEnd}
              className="flex items-center gap-4 border border-sand bg-cream-light p-3 cursor-grab active:cursor-grabbing hover:border-stone transition-colors"
            >
              {/* Drag handle */}
              <span className="text-stone select-none text-lg px-1">⠿</span>

              {/* Thumbnails */}
              <div className="flex gap-2 shrink-0">
                {srcs.map((src, j) => (
                  <div key={j} className="relative w-16 h-12 bg-sand overflow-hidden">
                    <Image
                      src={`/images/series/${series.slug}/${src}`}
                      alt={alts[j] ?? ""}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-mono-cap text-stone">{img.layout}</p>
                <p className="text-sm text-cocoa truncate">{srcs.join(", ")}</p>
                {img.caption && (
                  <p className="text-xs text-stone truncate">{img.caption}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setCoverImage(img)}
                  title="Set as cover"
                  className={`text-lg ${isCover ? "text-terracotta" : "text-sand hover:text-stone"} transition-colors`}
                >
                  ★
                </button>
                <button
                  onClick={() => deletePhoto(i, srcs[0])}
                  title="Delete"
                  className="text-mono-cap text-stone hover:text-red-600 transition-colors px-2"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
        {images.length === 0 && (
          <p className="text-stone py-8 text-center border border-dashed border-sand">
            No photos yet. Upload some below.
          </p>
        )}
      </div>

      {/* Upload form */}
      <div className="border-t border-sand pt-10">
        <h2 className="font-display text-h2 text-cocoa mb-6">Add Photo(s)</h2>
        <form onSubmit={handleUpload} className="space-y-5 max-w-lg">
          <div>
            <label className="text-mono-cap text-stone block mb-2">Layout</label>
            <select
              value={uploadLayout}
              onChange={(e) => setUploadLayout(e.target.value as SeriesImageLayout)}
              className="w-full border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa focus:outline-none focus:border-cocoa"
            >
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {LAYOUT_LABELS[l]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-mono-cap text-stone block mb-2">
              File{multiLayout ? `s (select ${LAYOUT_COUNT[uploadLayout]})` : ""}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiLayout}
              onChange={(e) => setUploadFiles(e.target.files)}
              required
              className="w-full text-sm text-stone file:mr-4 file:py-2 file:px-4 file:border-0 file:text-mono-cap file:bg-sand file:text-cocoa hover:file:bg-cream-deep"
            />
            {multiLayout && (
              <p className="text-xs text-stone mt-1">
                Hold Ctrl/Cmd to select multiple files. Order matters.
              </p>
            )}
          </div>

          <div>
            <label className="text-mono-cap text-stone block mb-2">
              Alt text{multiLayout ? " (separate multiple with |)" : ""}
            </label>
            <input
              type="text"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              placeholder={multiLayout ? "Alt for first | Alt for second" : "Describe the photo"}
              required
              className="w-full border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa focus:outline-none focus:border-cocoa"
            />
          </div>

          <div>
            <label className="text-mono-cap text-stone block mb-2">
              Caption <span className="font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="Optional caption shown under the photo"
              className="w-full border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa focus:outline-none focus:border-cocoa"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-cocoa text-cream-light text-mono-cap hover:bg-terracotta transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
