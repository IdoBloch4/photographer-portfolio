"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/site-content";

interface Props {
  initialContent: SiteContent;
}

export function ContentEditor({ initialContent }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function setHome<K extends keyof SiteContent["home"]>(
    key: K,
    value: SiteContent["home"][K]
  ) {
    setContent((c) => ({ ...c, home: { ...c.home, [key]: value } }));
  }

  function setBehindTheLens<K extends keyof SiteContent["behindTheLens"]>(
    key: K,
    value: SiteContent["behindTheLens"][K]
  ) {
    setContent((c) => ({
      ...c,
      behindTheLens: { ...c.behindTheLens, [key]: value },
    }));
  }

  function setContact<K extends keyof SiteContent["contact"]>(
    key: K,
    value: SiteContent["contact"][K]
  ) {
    setContent((c) => ({ ...c, contact: { ...c.contact, [key]: value } }));
  }

  function setParagraph(i: number, value: string) {
    const next = [...content.behindTheLens.paragraphs];
    next[i] = value;
    setBehindTheLens("paragraphs", next);
  }

  function addParagraph() {
    setBehindTheLens("paragraphs", [...content.behindTheLens.paragraphs, ""]);
  }

  function removeParagraph(i: number) {
    const next = content.behindTheLens.paragraphs.filter((_, j) => j !== i);
    setBehindTheLens("paragraphs", next);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    if (res.ok) {
      setMsg("Saved!");
    } else {
      setMsg("Error saving.");
    }
    setSaving(false);
    setTimeout(() => setMsg(null), 3000);
  }

  return (
    <div className="space-y-14">
      {/* Save bar */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-[#f9f7f4] py-3 border-b border-sand">
        <p className="text-mono-cap text-stone">Edit then save.</p>
        <div className="flex items-center gap-4">
          {msg && (
            <span className={`text-sm ${msg === "Saved!" ? "text-green-700" : "text-red-600"}`}>
              {msg}
            </span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2 bg-cocoa text-cream-light text-mono-cap hover:bg-terracotta transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      </div>

      {/* Home page */}
      <section>
        <h2 className="font-display text-h2 text-cocoa mb-6">Home Page</h2>
        <div className="space-y-5 max-w-2xl">
          <Field
            label="Tagline (use \\n for line break)"
            value={content.home.tagline}
            onChange={(v) => setHome("tagline", v)}
            multiline
          />
          <Field
            label="Quote (shown in the statement section)"
            value={content.home.quote}
            onChange={(v) => setHome("quote", v)}
            multiline
          />
        </div>
      </section>

      {/* Behind the Lens */}
      <section>
        <h2 className="font-display text-h2 text-cocoa mb-6">Behind the Lens</h2>
        <div className="space-y-5 max-w-2xl">
          <div>
            <label className="text-mono-cap text-stone block mb-3">
              Bio paragraphs
            </label>
            <div className="space-y-3">
              {content.behindTheLens.paragraphs.map((para, i) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    value={para}
                    onChange={(e) => setParagraph(i, e.target.value)}
                    rows={3}
                    className="flex-1 border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa focus:outline-none focus:border-cocoa resize-y"
                  />
                  <button
                    onClick={() => removeParagraph(i)}
                    className="text-stone hover:text-red-600 transition-colors px-2 self-start pt-2"
                    title="Remove paragraph"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addParagraph}
              className="mt-3 text-mono-cap text-stone hover:text-cocoa transition-colors"
            >
              + Add paragraph
            </button>
          </div>

          <Field
            label="Pull quote (must match one of the paragraphs above — this one gets the italic block style)"
            value={content.behindTheLens.pullQuote}
            onChange={(v) => setBehindTheLens("pullQuote", v)}
            multiline
          />
          <Field
            label="Based in"
            value={content.behindTheLens.basedIn}
            onChange={(v) => setBehindTheLens("basedIn", v)}
          />
          <Field
            label="Cameras"
            value={content.behindTheLens.cameras}
            onChange={(v) => setBehindTheLens("cameras", v)}
          />
          <Field
            label="Print"
            value={content.behindTheLens.print}
            onChange={(v) => setBehindTheLens("print", v)}
          />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="font-display text-h2 text-cocoa mb-6">Contact Page</h2>
        <div className="space-y-5 max-w-2xl">
          <Field
            label="Heading"
            value={content.contact.heading}
            onChange={(v) => setContact("heading", v)}
          />
          <Field
            label="Body text"
            value={content.contact.body}
            onChange={(v) => setContact("body", v)}
            multiline
          />
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-mono-cap text-stone block mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa focus:outline-none focus:border-cocoa resize-y"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-sand bg-cream-light px-3 py-2 text-sm text-cocoa focus:outline-none focus:border-cocoa"
        />
      )}
    </div>
  );
}
