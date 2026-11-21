import type { Preview } from "@storybook/react-vite";
import { themes, getPreferredColorScheme } from "storybook/theming";

/*
 * Tokens only — layer order, custom properties, and the shared compositions.
 * Component CSS already reaches the preview through each component's source CSS
 * module. The barrel's `globals.css` imports of the built sheets are stubbed in
 * main.ts, so importing a prebuilt bundle here would only add a second copy of
 * every component rule. Uses the `@tokens` alias from main.ts because
 * `@uiid/tokens` is not a dependency of this app.
 *
 * This is the only token source in Storybook: main.ts stubs the barrel's
 * `@uiid/tokens/globals.css` too, so removing this line strips tokens and layer
 * order from every story, MDX page and addon browser test.
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
          "Navigation",
          "Interactive",
          "Indicators",
          "Tables",
          "Code",
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
