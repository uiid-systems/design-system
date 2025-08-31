import type { Preview } from "@storybook/react-vite";

import "@uiid/tokens/globals.css";
import "@uiid/ui/globals.css";

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
        order: ["Tokens", "Typography", "Layout", "Buttons"],
        locales: "en-US",
      },
    },
  },
};

export default preview;
