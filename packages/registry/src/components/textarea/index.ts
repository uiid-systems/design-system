import { z } from "zod";

import { FormSize } from "../../shared";
import type { ComponentEntry } from "../../types";
import { textareaPreviews } from "./previews";

/**
 * Textarea resize options.
 */
export const TextareaResize = z.enum(["none", "vertical", "horizontal", "both"]);

/**
 * Textarea component props schema.
 */
export const TextareaPropsSchema = z.object({
  /** Textarea value (controlled) */
  value: z.string().optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.string().optional(),
  /** Placeholder text */
  placeholder: z.string().optional(),
  /** Number of visible text lines */
  rows: z.number().optional(),
  /** Resize behavior */
  resize: TextareaResize.optional(),
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
  /** Full width textarea */
  fullwidth: z.boolean().optional(),
  /** Ghost style (minimal borders) */
  ghost: z.boolean().optional(),
});

export type TextareaProps = z.infer<typeof TextareaPropsSchema>;

export const TextareaEntry: ComponentEntry<typeof TextareaPropsSchema> = {
  name: "Textarea",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: TextareaPropsSchema,
  description: "Multi-line text input with label and description support",
  category: "forms",
  defaults: {
    size: "medium",
    rows: 3,
    resize: "vertical",
  },
  previews: textareaPreviews,
};
