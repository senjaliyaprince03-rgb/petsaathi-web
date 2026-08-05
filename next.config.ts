import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep this independently deployable app isolated from the parent lockfile.
    root: process.cwd(),
  },
};

export default nextConfig;
