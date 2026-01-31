import type { PreviewConfig } from "../../types";

export const toggleButtonPreviews: PreviewConfig[] = [
  {
    label: "Bookmark toggle",
    tree: {
      root: "toggle",
      elements: {
        toggle: {
          key: "toggle",
          type: "ToggleButton",
          props: {
            text: { pressed: "Bookmarked", unpressed: "Bookmark" },
            size: "small",
          },
        },
      },
    },
  },
];
