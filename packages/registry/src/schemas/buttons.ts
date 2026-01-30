import { z } from "zod";

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
