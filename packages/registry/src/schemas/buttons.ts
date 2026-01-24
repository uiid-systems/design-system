import { z } from "zod";

import type { ComponentEntry, PreviewConfig } from "../types";

import { Size, Tone } from "./shared";

/**
 * Button variant values.
 */
export const ButtonVariant = z.enum(["subtle", "inverted"]);

/**
 * Button component props schema.
 */
export const ButtonPropsSchema = z.object({
  /** Button content */
  children: z.any().optional(),
  /** Size variant */
  size: Size.optional(),
  /** Visual variant */
  variant: ButtonVariant.optional(),
  /** Semantic color tone */
  tone: Tone.optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Loading state (shows spinner) */
  loading: z.boolean().optional(),
  /** Full width button */
  fullwidth: z.boolean().optional(),
  /** Ghost style (transparent background) */
  ghost: z.boolean().optional(),
  /** Pill shape (fully rounded) */
  pill: z.boolean().optional(),
  /** Square shape (equal width/height) */
  square: z.boolean().optional(),
  /** Grow to fill available space */
  grows: z.boolean().optional(),
  /** Circular button */
  circle: z.boolean().optional(),
  /** Tooltip content */
  tooltip: z.any().optional(),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

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

/**
 * Toggle button icon configuration.
 */
export const ToggleButtonIconSchema = z.object({
  pressed: z.any(),
  unpressed: z.any(),
});

/**
 * Toggle button text configuration.
 */
export const ToggleButtonTextSchema = z.object({
  pressed: z.string(),
  unpressed: z.string(),
});

/**
 * ToggleButton component props schema.
 * Extends Button with toggle state and dynamic icon/text.
 */
export const ToggleButtonPropsSchema = ButtonPropsSchema.extend({
  /** Whether the toggle is pressed */
  pressed: z.boolean().optional(),
  /** Default pressed state (uncontrolled) */
  defaultPressed: z.boolean().optional(),
  /** Icons for pressed/unpressed states */
  icon: ToggleButtonIconSchema.optional(),
  /** Text for pressed/unpressed states */
  text: ToggleButtonTextSchema.optional(),
});

export type ToggleButtonProps = z.infer<typeof ToggleButtonPropsSchema>;

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

