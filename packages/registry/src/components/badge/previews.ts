import type { PreviewConfig } from "../../types";

export const badgePreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "badges",
      elements: {
        badges: {
          key: "badges",
          type: "Group",
          props: { gap: 2 },
          children: ["default", "inverted"],
        },
        default: {
          key: "default",
          type: "Badge",
          props: { children: "Default" },
          parentKey: "badges",
        },
        inverted: {
          key: "inverted",
          type: "Badge",
          props: { inverted: true, children: "Inverted" },
          parentKey: "badges",
        },
      },
    },
  },
  {
    label: "Sizes",
    tree: {
      root: "badges",
      elements: {
        badges: {
          key: "badges",
          type: "Group",
          props: { gap: 2, ay: "center" },
          children: ["small", "medium", "large"],
        },
        small: {
          key: "small",
          type: "Badge",
          props: { size: "small", children: "Small" },
          parentKey: "badges",
        },
        medium: {
          key: "medium",
          type: "Badge",
          props: { size: "medium", children: "Medium" },
          parentKey: "badges",
        },
        large: {
          key: "large",
          type: "Badge",
          props: { size: "large", children: "Large" },
          parentKey: "badges",
        },
      },
    },
  },
  {
    label: "Text only",
    tree: {
      root: "badges",
      elements: {
        badges: {
          key: "badges",
          type: "Group",
          props: { gap: 2 },
          children: ["new", "beta", "pro"],
        },
        new: {
          key: "new",
          type: "Badge",
          props: { hideIndicator: true, children: "New" },
          parentKey: "badges",
        },
        beta: {
          key: "beta",
          type: "Badge",
          props: { hideIndicator: true, children: "Beta" },
          parentKey: "badges",
        },
        pro: {
          key: "pro",
          type: "Badge",
          props: { hideIndicator: true, children: "Pro" },
          parentKey: "badges",
        },
      },
    },
  },
];
