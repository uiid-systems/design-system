import type { Preview } from "@storybook/react-vite";

import "@uiid/design-system/globals.css";

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
          "Lists",
          "Forms",
          ["Form"],
          "Overlays",
          "Interactive",
          "Indicators",
          "Calendars",
          "Tables",
          "Navigation",
          "Backgrounds",
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
