import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { radioPreviews } from "./previews";

/**
 * Radio component props schema.
 */
export const RadioPropsSchema = z.object({
  /** Radio value */
  value: z.string(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Required field */
  required: z.boolean().optional(),
  /** Reverse label/radio order */
  reversed: z.boolean().optional(),
  /** Add border around the field */
  bordered: z.boolean().optional(),
  /** Hide the radio indicator */
  hideIndicator: z.boolean().optional(),
});

export type RadioProps = z.infer<typeof RadioPropsSchema>;

export const RadioEntry: ComponentEntry<typeof RadioPropsSchema> = {
  name: "Radio",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: RadioPropsSchema,
  description: "Radio button input with label and description support",
  category: "forms",
  defaults: {},
  previews: radioPreviews,
  usage: "Use Radio within a RadioGroup for single-select options. For standalone usage, wrap in RadioGroup.Root.",
};
