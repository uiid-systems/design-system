import type { ComponentEntry, PreviewConfig } from "../types";

import { ButtonPropsSchema, ToggleButtonPropsSchema } from "../schemas/buttons";

const buttonPreviews: PreviewConfig[] = [
  {
    label: "Sizes",
    tree: {
      root: "group",
      elements: {
        group: { key: "group", type: "Group", props: { gap: 4, ay: "center" }, children: ["sm", "md", "lg"] },
        sm: { key: "sm", type: "Button", props: { size: "small", children: "Small" }, parentKey: "group" },
        md: { key: "md", type: "Button", props: { size: "medium", children: "Medium" }, parentKey: "group" },
        lg: { key: "lg", type: "Button", props: { size: "large", children: "Large" }, parentKey: "group" },
      },
    },
  },
  {
    label: "Variants",
    tree: {
      root: "group",
      elements: {
        group: { key: "group", type: "Group", props: { gap: 4, ay: "center" }, children: ["default", "subtle", "inverted", "ghost"] },
        default: { key: "default", type: "Button", props: { children: "Default" }, parentKey: "group" },
        subtle: { key: "subtle", type: "Button", props: { variant: "subtle", children: "Subtle" }, parentKey: "group" },
        inverted: { key: "inverted", type: "Button", props: { variant: "inverted", children: "Inverted" }, parentKey: "group" },
        ghost: { key: "ghost", type: "Button", props: { ghost: true, children: "Ghost" }, parentKey: "group" },
      },
    },
  },
  {
    label: "Tones",
    tree: {
      root: "group",
      elements: {
        group: { key: "group", type: "Group", props: { gap: 4, ay: "center" }, children: ["neutral", "positive", "warning", "critical", "info"] },
        neutral: { key: "neutral", type: "Button", props: { children: "Neutral" }, parentKey: "group" },
        positive: { key: "positive", type: "Button", props: { tone: "positive", children: "Positive" }, parentKey: "group" },
        warning: { key: "warning", type: "Button", props: { tone: "warning", children: "Warning" }, parentKey: "group" },
        critical: { key: "critical", type: "Button", props: { tone: "critical", children: "Critical" }, parentKey: "group" },
        info: { key: "info", type: "Button", props: { tone: "info", children: "Info" }, parentKey: "group" },
      },
    },
  },
];

export const ButtonEntry: ComponentEntry<typeof ButtonPropsSchema> = {
  name: "Button",
  package: "@uiid/buttons",
  hasChildren: true,
  propsSchema: ButtonPropsSchema,
  description: "Primary action button with multiple size, variant, and tone options",
  category: "buttons",
  defaults: {
    size: "medium",
    grows: true,
  },
  previews: buttonPreviews,
  usage: "Use Button for primary actions. Set tone for semantic meaning, variant for visual weight, ghost for minimal chrome.",
};

export const ToggleButtonEntry: ComponentEntry<typeof ToggleButtonPropsSchema> = {
  name: "ToggleButton",
  package: "@uiid/buttons",
  hasChildren: true,
  propsSchema: ToggleButtonPropsSchema,
  description: "Toggle button with pressed/unpressed states and optional dynamic icon/text",
  category: "buttons",
  defaults: {
    size: "medium",
  },
};
