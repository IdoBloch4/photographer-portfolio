import type { Metadata, Viewport } from "next";
import { ViewTransitions } from "next-view-transitions";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#F5F0E1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${fontVariables} antialiased`} suppressHydrationWarning>
        <body
          className="min-h-screen flex flex-col bg-cream text-cocoa"
          suppressHydrationWarning
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-cream-light focus:px-4 focus:py-2 focus:text-cocoa"
          >
            Skip to main content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ViewTransitions>
  );
}
