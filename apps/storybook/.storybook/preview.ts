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
          "Buttons",
          "Cards",
          "Calendars",
          "Forms",
          ["Inputs", ["Input"], "Selects", ["Select"], "Typography"],
          "Dropdowns",
          ["Dropdown"],
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
