import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
