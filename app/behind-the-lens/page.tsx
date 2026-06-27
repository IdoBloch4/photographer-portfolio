import type { Metadata } from "next";
import { site } from "@/lib/site";
import { MailIcon } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Behind the Lens",
  description: `About ${site.name} — artist statement, philosophy, and gear.`,
};

export default function BehindTheLensPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 pt-16 sm:pt-24 pb-20">
      <div className="grid grid-cols-12 gap-8 lg:gap-16">
        {/* Portrait */}
        <aside className="col-span-12 lg:col-span-5">
          <div className="grain relative aspect-[4/5] bg-cream-deep overflow-hidden">
            {/* Portrait placeholder until a real photograph is added.
                Swap this for a <Photo /> referencing public/images/portrait.jpg */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #6B5B47 0%, #C67B5C 60%, #F5F0E1 100%)",
              }}
              aria-hidden="true"
            />
            <p className="absolute bottom-4 left-4 text-mono-cap text-cream-light">
              Portrait — to be added
            </p>
          </div>
        </aside>

        {/* Statement */}
        <section className="col-span-12 lg:col-span-7 max-w-[65ch]">
          <p className="text-mono-cap mb-4">Behind the Lens</p>
          <h1 className="font-display text-h1 tracking-tight text-cocoa mb-10">
            {site.name}
          </h1>

          <div className="space-y-6 text-lg leading-relaxed text-cocoa">
            <p>
              I make pictures slowly. I'd rather sit with a place for an hour
              than walk past ten of them — most of what I find good seems to
              ask for that kind of time.
            </p>

            <p className="font-display italic text-h2 text-stone py-4 border-l-2 border-terracotta pl-6">
              The work moves between scales — pollen on a stamen, an alley at
              dusk, a galaxy edge-on. To me they're the same picture, asked at
              different magnifications.
            </p>

            <p>
              I shoot 35mm digital and a small Pentax 645. I print on warm-tone
              paper. I do not retouch faces or edit out the small ugly things;
              they belong to the picture.
            </p>

            <p>
              Currently based between Tel Aviv and the Galilee. Available for
              private commissions, prints, and the occasional gallery
              correspondence — please write.
            </p>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-4 text-mono-cap">
            <dt>Based in</dt>
            <dd className="text-stone">Tel Aviv / Galilee</dd>
            <dt>Cameras</dt>
            <dd className="text-stone">Sony A7R IV · Pentax 645</dd>
            <dt>Print</dt>
            <dd className="text-stone">Hahnemühle Photo Rag Baryta</dd>
            <dt>Inquiries</dt>
            <dd className="text-stone">
              <a
                href={`mailto:${site.email}`}
                className="link-underline hover:text-terracotta"
              >
                <span className="inline-flex items-center gap-[0.3em]">
                  <MailIcon />
                  {site.email}
                </span>
              </a>
            </dd>
          </dl>
        </section>
      </div>
    </div>
  );
}
