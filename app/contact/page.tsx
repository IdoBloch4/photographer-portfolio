import type { Metadata } from "next";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/site-content";
import { MailIcon, InstagramIcon, FacebookIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}.`,
};

export default async function ContactPage() {
  const content = await getSiteContent();
  const { heading, body } = content.contact;

  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-24 sm:py-40 min-h-[60vh] flex flex-col justify-center">
      <p className="text-mono-cap mb-6">Inquiries · Prints · Commissions</p>
      <h1
        className="font-display tracking-tight text-cocoa mb-12 max-w-4xl"
        style={{
          fontSize: "clamp(2.5rem, 7vw, 6rem)",
          lineHeight: 1,
          fontVariationSettings: '"SOFT" 50, "opsz" 144',
        }}
      >
        {heading}
      </h1>
      <a
        href={`mailto:${site.email}`}
        className="link-underline font-display text-3xl sm:text-5xl text-terracotta self-start"
      >
        <span className="inline-flex items-center gap-[0.2em]">
          <MailIcon />
          {site.email}
        </span>
      </a>
      <p className="mt-16 max-w-md text-stone leading-relaxed">{body}</p>
      <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-mono-cap">
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
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-cocoa hover:text-terracotta"
          >
            <span className="inline-flex items-center gap-[0.3em]">
              <FacebookIcon />
              Facebook
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}
