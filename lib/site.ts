/**
 * Single source of truth for site-wide content strings.
 * Update name / tagline / contact here, not scattered across pages.
 */
export const site = {
  name: "Sarit Carmon",
  tagline: "Photographer · Landscape · Street · Macro · Astro · Abstract",
  shortTagline: "Photography",
  description:
    "Photographs by Sarit Carmon — a curated body of work spanning landscape, astro, macro, abstract, and street photography.",
  url: "https://saritcarmon.com",
  ogImage: "/og.jpg",
  email: "tirasc@gmail.com",
  instagram: "https://www.instagram.com/saritcarmon/",
  copyrightStart: 2026,
} as const;

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/behind-the-lens", label: "Behind the Lens" },
  { href: "/contact", label: "Contact" },
] as const;
