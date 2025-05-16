/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Add runtime configuration
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

module.exports = nextConfig;
