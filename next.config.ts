import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable API routes
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Ensure API routes are included in the build
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig;
