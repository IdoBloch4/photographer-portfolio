import { getSiteContent } from "@/lib/site-content";
import { ContentEditor } from "./ContentEditor";

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return (
    <div>
      <h1 className="font-display text-h1 tracking-tight text-cocoa mb-10">
        Site Content
      </h1>
      <ContentEditor initialContent={content} />
    </div>
  );
}
