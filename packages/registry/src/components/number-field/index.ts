import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { numberFieldPreviews } from "./previews";

/**
 * NumberField component props schema.
 */
export const NumberFieldPropsSchema = z.object({
  /** Current value (controlled) */
  value: z.number().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.number().optional(),
  /** Minimum value */
  min: z.number().optional(),
  /** Maximum value */
  max: z.number().optional(),
  /** Step increment */
  step: z.number().optional(),
  /** Placeholder text */
  placeholder: z.string().optional(),
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
});

export type NumberFieldProps = z.infer<typeof NumberFieldPropsSchema>;

export const NumberFieldEntry: ComponentEntry<typeof NumberFieldPropsSchema> = {
  name: "NumberField",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: NumberFieldPropsSchema,
  description: "Numeric input with increment/decrement buttons and optional label",
  category: "forms",
  defaults: {},
  previews: numberFieldPreviews,
  usage: "Use for numeric input with built-in increment/decrement controls. Supports min, max, and step constraints.",
};
