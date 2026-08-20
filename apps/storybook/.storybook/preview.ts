import type { Preview } from "@storybook/react-vite";
import { themes, getPreferredColorScheme } from "storybook/theming";

/*
 * Tokens only — layer order, custom properties, and the shared compositions.
 * Component CSS already reaches the preview through `@uiid/design-system`, whose
 * entry imports its own globals.css; importing the prebuilt bundle here as well
 * put a redundant third copy of every component rule on the page. Uses the
 * `@tokens` alias from main.ts because `@uiid/tokens` is not a dependency of
 * this app.
 */
import "@tokens/globals.css";
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
          "Overlays",
          ["Overview"],
          "Forms",
          ["Form"],
          "Interactive",
          "Indicators",
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
