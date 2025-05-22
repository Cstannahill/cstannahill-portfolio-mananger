import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  // Disable static export to avoid build-time execution
  output: undefined,
  // Disable optimizations that might trigger native code
};

export default nextConfig;
