import type { StorybookConfig } from "@storybook/react-vite";
import { applyPostCSSLayers } from "../src/utils/postcss-config";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/buttons/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/calendars/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/dropdowns/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/cards/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/forms/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/indicators/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/interactive/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/layout/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/overlays/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/tokens/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/typography/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "storybook-addon-test-codegen",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(config) {
    return applyPostCSSLayers(config);
  },
};

export default config;
