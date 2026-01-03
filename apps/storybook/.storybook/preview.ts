import type { Preview } from "@storybook/react-vite";

import "@uiid/tokens/globals.css";
import "@uiid/typography/globals.css";
import "@uiid/layout/globals.css";
import "@uiid/buttons/globals.css";
import "@uiid/cards/globals.css";
import "@uiid/calendars/globals.css";
import "@uiid/forms/globals.css";
import "@uiid/indicators/globals.css";
import "@uiid/interactive/globals.css";
import "@uiid/navigation/globals.css";
import "@uiid/overlays/globals.css";

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
          ["Primitives", "Components"],
          "Typography",
          "Layout",
          ["Utilities"],
          "Cards",
          "Buttons",
          "Forms",
          ["Form"],
          "Overlays",
          "Interactive",
          "Indicators",
          "Calendars",
          "Tables",
          "Navigation",
        ],
        locales: "en-US",
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
