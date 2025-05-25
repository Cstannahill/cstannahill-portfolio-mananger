import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["next-mdx-remote"],
  // transpilePackages: ["next-mdx-remote", "@mdx-js/react", "@mdx-js/runtime"],
};

export default nextConfig;
