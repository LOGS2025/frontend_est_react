import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // Important for Vercel deployment
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
