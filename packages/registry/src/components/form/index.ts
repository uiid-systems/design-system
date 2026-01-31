import { z } from "zod";

import type { ComponentEntry } from "../../types";

/**
 * Form component props schema.
 * Container for form fields with built-in validation support.
 */
export const FormPropsSchema = z.object({
  /** Gap between form fields */
  gap: z.number().optional(),
  /** Full width form */
  fullwidth: z.boolean().optional(),
});

export type FormProps = z.infer<typeof FormPropsSchema>;

export const FormEntry: ComponentEntry<typeof FormPropsSchema> = {
  name: "Form",
  package: "@uiid/forms",
  hasChildren: true,
  propsSchema: FormPropsSchema,
  description:
    "Form container with built-in validation support. Fields with required/pattern attributes validate on submit.",
  category: "forms",
  defaults: {
    gap: 4,
  },
};
