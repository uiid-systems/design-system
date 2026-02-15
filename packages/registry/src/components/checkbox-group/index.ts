import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { checkboxGroupPreviews } from "./previews";

/**
 * Checkbox group item schema for options.
 */
export const CheckboxGroupItemSchema = z.object({
  /** Display label */
  label: z.string(),
  /** Option value */
  value: z.string(),
  /** Disabled option */
  disabled: z.boolean().optional(),
});

/**
 * CheckboxGroup component props schema.
 */
export const CheckboxGroupPropsSchema = z.object({
  /** Selected values (controlled) */
  value: z.array(z.string()).optional(),
  /** Default values (uncontrolled) */
  defaultValue: z.array(z.string()).optional(),
  /** Checkbox options */
  items: z.array(CheckboxGroupItemSchema),
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
  /** Reverse label/checkbox order */
  reversed: z.boolean().optional(),
  /** Add border around each option */
  bordered: z.boolean().optional(),
  /** Hide checkbox indicators */
  hideIndicators: z.boolean().optional(),
  /** Field name for forms */
  name: z.string().optional(),
});

export type CheckboxGroupProps = z.infer<typeof CheckboxGroupPropsSchema>;

export const CheckboxGroupEntry: ComponentEntry<typeof CheckboxGroupPropsSchema> = {
  name: "CheckboxGroup",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: CheckboxGroupPropsSchema,
  description: "Group of checkboxes for multi-select options with label and description",
  category: "forms",
  defaults: {
    direction: "vertical",
  },
  previews: checkboxGroupPreviews,
  usage: "Use for multi-select choice lists. Pass items array with label/value pairs. Value is an array of selected values.",
};
