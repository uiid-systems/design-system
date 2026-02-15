import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { progressPreviews } from "./previews";

/**
 * Progress component props schema.
 */
export const ProgressPropsSchema = z.object({
  /** Current progress value (0-100 or null for indeterminate) */
  value: z.number().nullable(),
});

export type ProgressProps = z.infer<typeof ProgressPropsSchema>;

export const ProgressEntry: ComponentEntry<typeof ProgressPropsSchema> = {
  name: "Progress",
  package: "@uiid/indicators",
  hasChildren: false,
  propsSchema: ProgressPropsSchema,
  description: "Progress bar indicator for showing completion status",
  category: "indicators",
  defaults: {},
  previews: progressPreviews,
  usage: "Use to show progress of an operation. Pass null for indeterminate state.",
};
