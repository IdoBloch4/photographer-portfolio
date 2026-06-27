import { getAllSeries } from "@/lib/series";
import { getSiteContent } from "@/lib/site-content";
import HomePageEditor from "./HomePageEditor";

export const metadata = { title: "Home Page — Admin" };

export default async function AdminHomePage() {
  const [allSeries, siteContent] = await Promise.all([
    getAllSeries(),
    getSiteContent(),
  ]);

  // Only series that have at least one image
  const seriesWithImages = allSeries.filter((s) => s.images.length > 0);

  return (
    <div>
      <h1 className="font-display text-h1 tracking-tight text-cocoa mb-2">Home Page</h1>
      <p className="text-mono-cap text-stone mb-10">Hero photo and gallery series</p>
      <HomePageEditor
        allSeries={seriesWithImages.map((s) => ({
          slug: s.slug,
          title: s.title,
          year: s.year,
          cover: s.cover,
          images: s.images.map((img) => ({
            src: Array.isArray(img.src) ? img.src[0] : img.src,
            alt: Array.isArray(img.alt) ? img.alt[0] : img.alt,
            width: img.width,
            height: img.height,
          })),
        }))}
        initialHeroSeriesSlug={siteContent.home.heroSeriesSlug}
        initialHeroImageFilename={siteContent.home.heroImageFilename}
        initialFeaturedSlugs={siteContent.home.featuredSeriesSlugs}
      />
    </div>
  );
}
