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
  {
    label: "With text",
    tree: {
      root: "stack",
      elements: {
        stack: {
          key: "stack",
          type: "Stack",
          props: { gap: 4, ax: "stretch" },
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
          children: ["sep-label"],
          parentKey: "stack",
        },
        "sep-label": {
          key: "sep-label",
          type: "Text",
          props: { size: 0, shade: "muted", children: "or continue with email" },
          parentKey: "sep",
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
