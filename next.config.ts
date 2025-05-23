import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile MDX-related packages to ensure compatibility
  transpilePackages: ["next-mdx-remote", "@mdx-js/react", "@mdx-js/runtime"],

  // Configure webpack to resolve React properly
};

export default nextConfig;
