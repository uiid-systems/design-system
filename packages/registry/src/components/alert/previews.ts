import type { PreviewConfig } from "../../types";

export const alertPreviews: PreviewConfig[] = [
  {
    label: "Tones",
    tree: {
      root: "alerts",
      elements: {
        alerts: {
          key: "alerts",
          type: "Stack",
          props: { gap: 4 },
          children: ["default", "info", "warning", "critical", "positive"],
        },
        default: {
          key: "default",
          type: "Alert",
          props: {
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
        info: {
          key: "info",
          type: "Alert",
          props: {
            tone: "info",
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
        warning: {
          key: "warning",
          type: "Alert",
          props: {
            tone: "warning",
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
        critical: {
          key: "critical",
          type: "Alert",
          props: {
            tone: "critical",
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
        positive: {
          key: "positive",
          type: "Alert",
          props: {
            tone: "positive",
            title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          },
          parentKey: "alerts",
        },
      },
    },
  },
];
