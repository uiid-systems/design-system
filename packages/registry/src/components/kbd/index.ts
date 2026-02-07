import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { kbdPreviews } from "./previews";

/**
 * Kbd component props schema.
 */
export const KbdPropsSchema = z.object({
  /** Key label */
  children: z.any().optional(),
});

export type KbdProps = z.infer<typeof KbdPropsSchema>;

export const KbdEntry: ComponentEntry<typeof KbdPropsSchema> = {
  name: "Kbd",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: KbdPropsSchema,
  description: "Keyboard key indicator for displaying keyboard shortcuts",
  category: "indicators",
  defaults: {},
  previews: kbdPreviews,
  usage:
    "Use Kbd to display keyboard shortcuts. Wrap each key separately for multi-key combinations.",
};
