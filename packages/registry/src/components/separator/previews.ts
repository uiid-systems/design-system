import type { PreviewConfig } from "../../types";

export const separatorPreviews: PreviewConfig[] = [
  {
    label: "Content divider",
    tree: {
      root: "stack",
      elements: {
        stack: {
          key: "stack",
          type: "Stack",
          props: { gap: 4 },
          children: ["above", "sep", "below"],
        },
        above: {
          key: "above",
          type: "Text",
          props: { weight: "bold", children: "Section one" },
          parentKey: "stack",
        },
        sep: {
          key: "sep",
          type: "Separator",
          props: {},
          parentKey: "stack",
        },
        below: {
          key: "below",
          type: "Text",
          props: { shade: "muted", children: "Section two" },
          parentKey: "stack",
        },
      },
    },
  },
];
