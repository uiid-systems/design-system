import type { PreviewConfig } from "../../types";

export const switchPreviews: PreviewConfig[] = [
  {
    label: "Setting toggle",
    tree: {
      root: "switch",
      elements: {
        switch: {
          key: "switch",
          type: "Switch",
          props: {
            label: "Push notifications",
            description: "Receive alerts for mentions and replies.",
            defaultChecked: true,
          },
        },
      },
    },
  },
];
