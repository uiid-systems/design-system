import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { ButtonPropsSchema } from "../button";

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
