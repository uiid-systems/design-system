import type { Preview } from "@storybook/react-vite";

import "@uiid/tokens";
import "@uiid/ui/globals";

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
