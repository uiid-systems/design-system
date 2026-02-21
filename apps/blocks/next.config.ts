import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@uiid/blocks",
    "@uiid/buttons",
    "@uiid/cards",
    "@uiid/forms",
    "@uiid/layout",
    "@uiid/registry",
    "@uiid/typography",
  ],
};

export default nextConfig;

