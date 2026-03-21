import type { PreviewConfig } from "../../types";

export const alertPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "alerts",
      elements: {
        alerts: {
          key: "alerts",
          type: "Stack",
          props: { gap: 4 },
          children: ["default", "inverted"],
        },
        default: {
          key: "default",
          type: "Alert",
          props: {
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
        inverted: {
          key: "inverted",
          type: "Alert",
          props: {
            inverted: true,
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
      },
    },
  },
];
