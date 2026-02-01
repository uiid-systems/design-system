import { z } from "zod";

import { Size, Tone } from "../../shared";
import type { ComponentEntry } from "../../types";
import { buttonPreviews } from "./previews";

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
  interactive: z.boolean().optional(),
  /** Circular button */
  circle: z.boolean().optional(),
  /** Tooltip content */
  tooltip: z.any().optional(),
});

export type ButtonProps = z.infer<typeof ButtonPropsSchema>;

export const ButtonEntry: ComponentEntry<typeof ButtonPropsSchema> = {
  name: "Button",
  package: "@uiid/buttons",
  hasChildren: true,
  propsSchema: ButtonPropsSchema,
  description:
    "Primary action button with multiple size, variant, and tone options",
  category: "buttons",
  defaults: {
    size: "medium",
    interactive: true,
  },
  previews: buttonPreviews,
  usage:
    "Use Button for primary actions. Set tone for semantic meaning, variant for visual weight, ghost for minimal chrome.",
};
