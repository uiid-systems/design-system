import type { PreviewConfig } from "../../types";

export const buttonPreviews: PreviewConfig[] = [
  {
    label: "Default",
    tree: {
      root: "button",
      elements: {
        button: {
          key: "button",
          type: "Button",
          props: { children: "Button" },
        },
      },
    },
  },
  {
    label: "Sizes",
    tree: {
      root: "group",
      elements: {
        group: {
          key: "group",
          type: "Group",
          props: { gap: 2, ay: "center" },
          children: ["small", "medium", "large"],
        },
        small: {
          key: "small",
          type: "Button",
          props: { size: "small", children: "Small" },
          parentKey: "group",
        },
        medium: {
          key: "medium",
          type: "Button",
          props: { size: "medium", children: "Medium" },
          parentKey: "group",
        },
        large: {
          key: "large",
          type: "Button",
          props: { size: "large", children: "Large" },
          parentKey: "group",
        },
      },
    },
  },
  {
    label: "Variants",
    tree: {
      root: "group",
      elements: {
        group: {
          key: "group",
          type: "Group",
          props: { gap: 2, ay: "center" },
          children: [
            "default",
            "subtle",
            "inverted",
            "ghost",
          ],
        },
        default: {
          key: "default",
          type: "Button",
          props: { children: "Default" },
          parentKey: "group",
        },
        subtle: {
          key: "subtle",
          type: "Button",
          props: { variant: "subtle", children: "Subtle" },
          parentKey: "group",
        },
        inverted: {
          key: "inverted",
          type: "Button",
          props: { variant: "inverted", children: "Inverted" },
          parentKey: "group",
        },
        ghost: {
          key: "ghost",
          type: "Button",
          props: { variant: "ghost", children: "Ghost" },
          parentKey: "group",
        },
      },
    },
  },
];
