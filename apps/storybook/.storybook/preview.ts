import type { Preview } from "@storybook/react-vite";
import { themes, getPreferredColorScheme } from "storybook/theming";

import "@uiid/design-system/globals.css";
import "./styles.css";

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes[getPreferredColorScheme()],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Releases",
          "AI Agent Guidelines",
          "Tokens",
          ["Primitives", "Components"],
          "Typography",
          ["Overview"],
          "Layout",
          ["Overview"],
          "Cards",
          ["Overview"],
          "Buttons",
          ["Overview"],
          "Lists",
          ["Overview"],
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
