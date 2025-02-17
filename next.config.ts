import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // This allows production builds to complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  // You can add additional Next.js configuration options here.
};

export default nextConfig;
