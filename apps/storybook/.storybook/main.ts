import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/primitives/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/tokens/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/typography/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
};

export default config;
