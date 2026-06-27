import { promises as fs } from "node:fs";
import path from "node:path";

export interface SiteContent {
  home: {
    tagline: string;
    quote: string;
    heroSeriesSlug: string;
    heroImageFilename: string;
    featuredSeriesSlugs: string[];
  };
  behindTheLens: {
    paragraphs: string[];
    pullQuote: string;
    basedIn: string;
    cameras: string;
    print: string;
  };
  contact: {
    heading: string;
    body: string;
  };
}

const CONTENT_PATH = path.join(process.cwd(), "content", "site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf8");
}
