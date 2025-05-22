import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Disable static export to avoid build-time execution
  output: undefined,
  // Disable optimizations that might trigger native code
  experimental: {
    optimizePackageImports: [],
  },
  // Disable MDX if you're using it
  pageExtensions: ["tsx", "ts", "jsx", "js"], // Remove 'mdx' if present
};

export default nextConfig;
