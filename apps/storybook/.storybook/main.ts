import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import { applyPostCSSLayers } from "../src/utils/postcss-config";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/buttons/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/calendars/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/cards/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/forms/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/indicators/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/interactive/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/layout/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/navigation/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/overlays/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/tables/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/tokens/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/typography/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
    // getAbsolutePath("storybook-addon-test-codegen"),
    getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  async viteFinal(config) {
    return applyPostCSSLayers(config);
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
