import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { radioGroupPreviews } from "./previews";

/**
 * Radio group item schema for options.
 */
export const RadioGroupItemSchema = z.object({
  /** Display label */
  label: z.string(),
  /** Option value */
  value: z.string(),
  /** Disabled option */
  disabled: z.boolean().optional(),
});

/**
 * RadioGroup component props schema.
 */
export const RadioGroupPropsSchema = z.object({
  /** Selected value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Radio options */
  items: z.array(RadioGroupItemSchema),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Layout direction */
  direction: z.enum(["horizontal", "vertical"]).optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Reverse label/radio order */
  reversed: z.boolean().optional(),
  /** Add border around each option */
  bordered: z.boolean().optional(),
  /** Hide radio indicators */
  hideIndicators: z.boolean().optional(),
  /** Field name for forms */
  name: z.string().optional(),
});

export type RadioGroupProps = z.infer<typeof RadioGroupPropsSchema>;

export const RadioGroupEntry: ComponentEntry<typeof RadioGroupPropsSchema> = {
  name: "RadioGroup",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: RadioGroupPropsSchema,
  description: "Group of radio buttons for single-select options with label and description",
  category: "forms",
  defaults: {
    direction: "vertical",
  },
  previews: radioGroupPreviews,
  usage: "Use for single-select choice lists. Pass items array with label/value pairs.",
};
