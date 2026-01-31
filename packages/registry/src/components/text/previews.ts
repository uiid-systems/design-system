import type { PreviewConfig } from "../../types";

export const textPreviews: PreviewConfig[] = [
  {
    label: "Article heading",
    tree: {
      root: "stack",
      elements: {
        stack: {
          key: "stack",
          type: "Stack",
          props: { gap: 2 },
          children: ["heading", "body"],
        },
        heading: {
          key: "heading",
          type: "Text",
          props: { size: 4, weight: "bold", children: "Getting started" },
          parentKey: "stack",
        },
        body: {
          key: "body",
          type: "Text",
          props: {
            shade: "muted",
            children:
              "Follow these steps to set up your workspace and start building.",
          },
          parentKey: "stack",
        },
      },
    },
  },
];
