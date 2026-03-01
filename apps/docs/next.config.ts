import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@uiid/buttons",
    "@uiid/calendars",
    "@uiid/cards",
    "@uiid/code",
    "@uiid/forms",
    "@uiid/icons",
    "@uiid/indicators",
    "@uiid/interactive",
    "@uiid/layout",
    "@uiid/lists",
    "@uiid/navigation",
    "@uiid/overlays",
    "@uiid/registry",
    "@uiid/tables",
    "@uiid/tokens",
    "@uiid/typography",
    "@uiid/utils",
  ],
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: "../..",
  },
};

export default nextConfig;
