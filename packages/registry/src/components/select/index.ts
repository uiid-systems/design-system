import { z } from "zod";

import { FormSize } from "../../shared";
import type { ComponentEntry } from "../../types";

/**
 * Select item schema for options.
 */
export const SelectItemSchema = z.object({
  /** Display label */
  label: z.string(),
  /** Option value */
  value: z.string(),
  /** Optional description */
  description: z.string().optional(),
  /** Disabled option */
  disabled: z.boolean().optional(),
});

/**
 * Select component props schema.
 */
export const SelectPropsSchema = z.object({
  /** Selected value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Placeholder text when no selection */
  placeholder: z.string().optional(),
  /** Select options */
  items: z.array(SelectItemSchema).optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Size variant */
  size: FormSize.optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Full width select */
  fullwidth: z.boolean().optional(),
  /** Ghost style */
  ghost: z.boolean().optional(),
});

export type SelectProps = z.infer<typeof SelectPropsSchema>;

export const SelectEntry: ComponentEntry<typeof SelectPropsSchema> = {
  name: "Select",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: SelectPropsSchema,
  description: "Dropdown select with customizable options, label, and description",
  category: "forms",
  defaults: {
    size: "medium",
  },
};
