import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // This allows production builds to complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  // You can add additional Next.js configuration options here.
  images: {
    // Disables image optimization so that images from any domain can be used.
    // Note: This will disable all the built-in optimizations provided by Next.js.
    unoptimized: true,
  },
};

export default nextConfig;
