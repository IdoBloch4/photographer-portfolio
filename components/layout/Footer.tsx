import Link from "next/link";
import { site } from "@/lib/site";
import { MailIcon, InstagramIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  const yearLabel =
    year > site.copyrightStart ? `${site.copyrightStart}–${year}` : `${year}`;

  return (
    <footer className="border-t border-sand bg-cream-deep mt-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        <div>
          <p
            className="font-display text-2xl text-cocoa"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 60' }}
          >
            {site.name}
          </p>
          <p className="text-mono-cap mt-1">© {yearLabel}</p>
        </div>

        <ul className="flex flex-col sm:flex-row gap-3 sm:gap-8 text-sm">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="link-underline text-cocoa hover:text-terracotta"
            >
              <span className="inline-flex items-center gap-[0.3em]">
                <MailIcon />
                {site.email}
              </span>
            </a>
          </li>
          <li>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-cocoa hover:text-terracotta"
            >
              <span className="inline-flex items-center gap-[0.3em]">
                <InstagramIcon />
                Instagram
              </span>
            </a>
          </li>
          <li>
            <Link
              href="/contact"
              className="link-underline text-cocoa hover:text-terracotta"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
