"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "yet-another-react-lightbox/styles.css";
import type { FlatImage } from "@/lib/series";

// Dynamically import the lightbox so its CSS + JS aren't shipped on the
// initial page load. The chunk is fetched the first time a user clicks an
// image — well within human reaction time after the click.
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

interface SeriesLightboxProps {
  images: FlatImage[];
}

export function SeriesLightbox({ images }: SeriesLightboxProps) {
  const [index, setIndex] = useState(-1);

  // Listen for clicks on any element marked with `data-lightbox-src`. Using a
  // delegated listener so server-rendered Photo overlay buttons work without
  // hydrating each one as a client component.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const trigger = target.closest<HTMLElement>("[data-lightbox-src]");
      if (!trigger) return;
      const src = trigger.getAttribute("data-lightbox-src");
      if (!src) return;
      const i = images.findIndex((img) => img.src === src);
      if (i < 0) return;
      e.preventDefault();
      setIndex(i);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [images]);

  return (
    <Lightbox
      open={index >= 0}
      close={() => setIndex(-1)}
      index={index >= 0 ? index : 0}
      slides={images.map((img) => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height,
        description: img.caption,
      }))}
      controller={{ closeOnBackdropClick: true }}
      animation={{ fade: 200, swipe: 300 }}
      carousel={{ preload: 2 }}
      styles={{
        container: { backgroundColor: "rgba(42, 31, 24, 0.96)" },
        slide: { padding: 0 },
      }}
    />
  );
}
