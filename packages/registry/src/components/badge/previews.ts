import type { PreviewConfig } from "../../types";

export const badgePreviews: PreviewConfig[] = [
  {
    label: "Tones",
    tree: {
      root: "badges",
      elements: {
        badges: {
          key: "badges",
          type: "Group",
          props: { gap: 2 },
          children: ["default", "info", "positive", "warning", "critical"],
        },
        default: {
          key: "default",
          type: "Badge",
          props: { children: "Default" },
          parentKey: "badges",
        },
        info: {
          key: "info",
          type: "Badge",
          props: { tone: "info", children: "Info" },
          parentKey: "badges",
        },
        positive: {
          key: "positive",
          type: "Badge",
          props: { tone: "positive", children: "Positive" },
          parentKey: "badges",
        },
        warning: {
          key: "warning",
          type: "Badge",
          props: { tone: "warning", children: "Warning" },
          parentKey: "badges",
        },
        critical: {
          key: "critical",
          type: "Badge",
          props: { tone: "critical", children: "Critical" },
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
          props: { size: "small", tone: "info", children: "Small" },
          parentKey: "badges",
        },
        medium: {
          key: "medium",
          type: "Badge",
          props: { size: "medium", tone: "info", children: "Medium" },
          parentKey: "badges",
        },
        large: {
          key: "large",
          type: "Badge",
          props: { size: "large", tone: "info", children: "Large" },
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
          props: { hideIndicator: true, tone: "info", children: "New" },
          parentKey: "badges",
        },
        beta: {
          key: "beta",
          type: "Badge",
          props: { hideIndicator: true, tone: "warning", children: "Beta" },
          parentKey: "badges",
        },
        pro: {
          key: "pro",
          type: "Badge",
          props: { hideIndicator: true, tone: "positive", children: "Pro" },
          parentKey: "badges",
        },
      },
    },
  },
];
