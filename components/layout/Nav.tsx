"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { navLinks, site } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrollYRef = useRef(0);

  // Close mobile sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // iOS-safe scroll lock: position:fixed trick preserves fixed children visibility.
  // overflow:hidden on body is NOT used because on iOS Safari it hides
  // position:fixed elements inside the same stacking context.
  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-sand/60">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
        <Link
          href="/"
          aria-label={`${site.name} — Home`}
          className="font-display text-lg sm:text-xl tracking-tight text-cocoa"
          style={{ fontVariationSettings: '"SOFT" 60, "opsz" 60' }}
        >
          {site.name}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`link-underline text-sm tracking-wide ${
                    active ? "text-terracotta" : "text-cocoa hover:text-terracotta"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-cocoa"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            {open ? (
              <path
                d="M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            ) : (
              <path
                d="M3 6h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile sheet — no sm:hidden here; the {open &&} gate is enough.
          sm:hidden was previously causing display:none to win over fixed
          positioning on certain iOS/Android browsers. */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 bg-cream z-50 overflow-y-auto"
        >
          <ul className="flex flex-col px-6 py-10 gap-6">
            {navLinks.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-display text-3xl tracking-tight ${
                      active ? "text-terracotta" : "text-cocoa"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
