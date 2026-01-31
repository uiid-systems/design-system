import { z } from "zod";

import { FormSize } from "../../shared";
import type { ComponentEntry } from "../../types";
import { inputPreviews } from "./previews";

/**
 * Input component props schema.
 */
export const InputPropsSchema = z.object({
  /** Input value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Placeholder text */
  placeholder: z.string().optional(),
  /** Input type */
  type: z.string().optional(),
  /** Size variant */
  size: FormSize.optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description/helper text */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Full width input */
  fullwidth: z.boolean().optional(),
  /** Ghost style (minimal borders) */
  ghost: z.boolean().optional(),
});

export type InputProps = z.infer<typeof InputPropsSchema>;

export const InputEntry: ComponentEntry<typeof InputPropsSchema> = {
  name: "Input",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: InputPropsSchema,
  description: "Text input field with label and description support",
  category: "forms",
  defaults: {
    size: "medium",
  },
  previews: inputPreviews,
};
