import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { checkboxPreviews } from "./previews";

/**
 * Checkbox component props schema.
 */
export const CheckboxPropsSchema = z.object({
  /** Checked state (controlled) */
  checked: z.boolean().optional(),
  /** Default checked state (uncontrolled) */
  defaultChecked: z.boolean().optional(),
  /** Indeterminate state */
  indeterminate: z.boolean().optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Field name for forms */
  name: z.string().optional(),
  /** Reverse label/checkbox order */
  reversed: z.boolean().optional(),
  /** Add border around the field */
  bordered: z.boolean().optional(),
});

export type CheckboxProps = z.infer<typeof CheckboxPropsSchema>;

export const CheckboxEntry: ComponentEntry<typeof CheckboxPropsSchema> = {
  name: "Checkbox",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: CheckboxPropsSchema,
  description: "Checkbox input with label, description, and indeterminate state support",
  category: "forms",
  defaults: {},
  previews: checkboxPreviews,
};
