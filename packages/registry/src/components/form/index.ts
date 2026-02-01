import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { formPreviews } from "./previews";

/**
 * Form component props schema.
 * Container for form fields with built-in validation support.
 */
export const FormPropsSchema = z.object({});

export type FormProps = z.infer<typeof FormPropsSchema>;

export const FormEntry: ComponentEntry<typeof FormPropsSchema> = {
  name: "Form",
  package: "@uiid/forms",
  hasChildren: true,
  propsSchema: FormPropsSchema,
  description: "Form container with built-in validation support.",
  category: "forms",
  defaults: {},
  usage:
    "Form has no visual presence (display:contents). Wrap a Stack inside it for spacing between fields.",
  previews: formPreviews,
};
