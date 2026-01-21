import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: "../..", // Points to design-system root for workspace package resolution
  },
};

export default nextConfig;
