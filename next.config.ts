import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project — silences the warning caused by
  // an unrelated package-lock.json in the user's home directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Tightened device widths — drops some defaults we don't need for a portfolio
    deviceSizes: [400, 640, 828, 1080, 1280, 1920, 2560],
    imageSizes: [16, 32, 64, 128, 256, 384],
    // Allowed quality values — must include any value used via `quality` prop
    qualities: [75, 88, 92],
  },
  experimental: {
    optimizePackageImports: ["motion", "yet-another-react-lightbox"],
  },
};

export default nextConfig;
