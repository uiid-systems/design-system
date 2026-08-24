import path from "node:path";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
