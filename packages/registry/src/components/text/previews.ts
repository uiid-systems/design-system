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
          props: { gap: 4 },
          children: ["heading", "body", "small"],
        },
        heading: {
          key: "heading",
          type: "Text",
          props: {
            size: 4,
            weight: "bold",
            children: "A guide  to getting started",
          },
          parentKey: "stack",
        },
        body: {
          key: "body",
          type: "Text",
          props: {
            size: 1,
            shade: "muted",
            children:
              "Follow these steps to set up your workspace and start building.",
          },
          parentKey: "stack",
        },
        small: {
          key: "small",
          type: "Text",
          props: {
            size: -1,
            shade: "muted",
            mt: 4,
            children: "Last updated 1 day ago",
          },
          parentKey: "stack",
        },
      },
    },
  },
];
