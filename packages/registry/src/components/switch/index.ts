import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { switchPreviews } from "./previews";

/**
 * Switch component props schema.
 */
export const SwitchPropsSchema = z.object({
  /** Checked state (controlled) */
  checked: z.boolean().optional(),
  /** Default checked state (uncontrolled) */
  defaultChecked: z.boolean().optional(),
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
  /** Reverse label/switch order */
  reversed: z.boolean().optional(),
  /** Add border around the field */
  bordered: z.boolean().optional(),
});

export type SwitchProps = z.infer<typeof SwitchPropsSchema>;

export const SwitchEntry: ComponentEntry<typeof SwitchPropsSchema> = {
  name: "Switch",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: SwitchPropsSchema,
  description: "Toggle switch with label and description support",
  category: "forms",
  defaults: {},
  previews: switchPreviews,
};
