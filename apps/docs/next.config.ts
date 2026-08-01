import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: "../..",
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
