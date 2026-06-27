"use client";

import { useEffect, useRef, useState } from "react";

interface FadeUpOnViewProps {
  children: React.ReactNode;
  /** Stagger offset in ms — useful in lists */
  delayMs?: number;
  /** Pixels to offset the IntersectionObserver root margin (negative = trigger before in view) */
  rootMargin?: string;
}

/**
 * Wraps children in a div that fades up + slight scale-in when first scrolled
 * into view. Uses Intersection Observer; cleans up after one trigger so it
 * doesn't fire on every scroll.
 */
export function FadeUpOnView({
  children,
  delayMs = 0,
  rootMargin = "0px 0px -10% 0px",
}: FadeUpOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Old browser fallback — render visible immediately
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin, threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
