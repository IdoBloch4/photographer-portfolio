import { getAllSeries } from "@/lib/series";
import { WorkIndex } from "@/components/work/WorkIndex";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "All series — landscape, astro, macro, street, and abstract photography.",
};

export default async function WorkPage() {
  const series = await getAllSeries();
  return (
    <div className="mx-auto max-w-[1440px] px-6 sm:px-10 pt-16 sm:pt-24 pb-20">
      <header className="mb-12 sm:mb-16">
        <p className="text-mono-cap mb-4">All series</p>
        <h1 className="font-display text-h1 tracking-tight text-cocoa">Work</h1>
      </header>
      <WorkIndex series={series} />
    </div>
  );
}
