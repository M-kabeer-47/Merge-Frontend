import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["plus.unsplash.com", "images.unsplash.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  /* config options here */
};

export default nextConfig;
