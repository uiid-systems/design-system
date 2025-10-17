import type { Preview } from "@storybook/react-vite";

import "@uiid/tokens/globals.css";
import "@uiid/typography/globals.css";
import "@uiid/layout/globals.css";
import "@uiid/buttons/globals.css";

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
        order: [
          "Tokens",
          "Typography",
          "Layout",
          "Buttons",
          "Forms",
          "Indicators",
          "Interactive",
          "Overlays",
        ],
        locales: "en-US",
      },
    },
  },
};

export default preview;
