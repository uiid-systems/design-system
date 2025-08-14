import type { Preview } from "@storybook/react-vite";

import "@uiid/tokens";

const preview: Preview = {
  // tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Tokens", "Components"],
        locales: "en-US",
      },
    },
  },
};

export default preview;
