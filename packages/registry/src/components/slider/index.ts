import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { sliderPreviews } from "./previews";

/**
 * Slider component props schema.
 */
export const SliderPropsSchema = z.object({
  /** Current value (controlled) */
  value: z.union([z.number(), z.array(z.number())]).optional(),
  /** Default value (uncontrolled) */
  defaultValue: z.union([z.number(), z.array(z.number())]).optional(),
  /** Minimum value */
  min: z.number().optional(),
  /** Maximum value */
  max: z.number().optional(),
  /** Step increment */
  step: z.number().optional(),
  /** Field label */
  label: z.string().optional(),
  /** Field description */
  description: z.string().optional(),
  /** Disabled state */
  disabled: z.boolean().optional(),
  /** Ghost style (no background) */
  ghost: z.boolean().optional(),
  /** Full width */
  fullwidth: z.boolean().optional(),
});

export type SliderProps = z.infer<typeof SliderPropsSchema>;

export const SliderEntry: ComponentEntry<typeof SliderPropsSchema> = {
  name: "Slider",
  package: "@uiid/forms",
  hasChildren: false,
  propsSchema: SliderPropsSchema,
  description: "Range slider input with optional label and description",
  category: "forms",
  defaults: {
    min: 0,
    max: 100,
    step: 1,
  },
  previews: sliderPreviews,
  usage: "Use for selecting numeric values within a range. Supports single value or range (array of two values).",
};
