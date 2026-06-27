"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, AnimatePresence } from "motion/react";
import Image from "next/image";

interface Hovered {
  src: string;
  blur: string;
  width: number;
  height: number;
  slug: string;
}

/**
 * Floating image that follows the cursor when it is currently over an
 * element marked with `data-series-cover` (the series row links rendered by
 * WorkIndex). Visibility is driven by `pointermove` so the preview
 * disappears the instant the cursor moves onto anything else — top nav,
 * page chrome, whitespace — rather than relying on enter/leave events that
 * can miss edges. Disabled on touch devices and respects
 * prefers-reduced-motion.
 */
export function CursorImagePreview() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState<Hovered | null>(null);
  // Refs so the listener can compare without re-binding on every state change.
  const currentSlugRef = useRef<string | null>(null);
  const firstHoverRef = useRef(true);

  const x = useSpring(0, { stiffness: 220, damping: 28, mass: 1 });
  const y = useSpring(0, { stiffness: 220, damping: 28, mass: 1 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarsePointer = window.matchMedia("(hover: none)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isCoarsePointer || reduceMotion) return;
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = (e.target as Element | null)?.closest?.<HTMLElement>(
        "[data-series-cover]"
      );

      if (target) {
        const slug = target.getAttribute("data-series-slug") ?? "";
        if (slug !== currentSlugRef.current) {
          currentSlugRef.current = slug;
          // Jump position on first hover to avoid easing in from (0,0)
          if (firstHoverRef.current) {
            firstHoverRef.current = false;
            x.jump(e.clientX);
            y.jump(e.clientY);
          }
          const src = target.getAttribute("data-series-cover");
          if (src) {
            setHovered({
              src,
              blur: target.getAttribute("data-series-blur") ?? "",
              width: parseInt(target.getAttribute("data-series-w") ?? "1200", 10),
              height: parseInt(target.getAttribute("data-series-h") ?? "800", 10),
              slug,
            });
          }
        }
      } else if (currentSlugRef.current !== null) {
        currentSlugRef.current = null;
        setHovered(null);
      }
    };

    // Hide if the cursor leaves the document entirely (e.g. into devtools)
    const onLeave = () => {
      currentSlugRef.current = null;
      setHovered(null);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 50,
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        {hovered ? (
          <motion.div
            key={hovered.src}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="grain bg-cream-deep shadow-2xl"
            style={{
              width: 380,
              viewTransitionName: hovered.slug ? `cover-${hovered.slug}` : undefined,
            }}
          >
            <Image
              src={hovered.src}
              alt=""
              width={hovered.width}
              height={hovered.height}
              sizes="380px"
              placeholder={hovered.blur ? "blur" : "empty"}
              blurDataURL={hovered.blur || undefined}
              draggable={false}
              className="block w-full h-auto select-none"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
