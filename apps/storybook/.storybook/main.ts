import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import { applyPostCSSLayers } from "../src/utils/postcss-config.ts";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest"),
    // getAbsolutePath("storybook-addon-test-codegen"),
    getAbsolutePath("storybook-addon-tag-badges"),
    "@github-ui/storybook-addon-performance-panel",
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  async viteFinal(config) {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    if (!config.resolve) config.resolve = {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tokens": resolve(__dirname, "../../../packages/tokens/src"),
    };

    return applyPostCSSLayers(config);
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
