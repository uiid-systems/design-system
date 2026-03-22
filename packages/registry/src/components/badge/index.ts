import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { badgePreviews } from "./previews";

/**
 * Badge size values.
 */
export const BadgeSize = z.enum(["small", "medium", "large"]);

/**
 * Badge component props schema.
 */
export const BadgePropsSchema = z.object({
  /** Badge label */
  children: z.any().optional(),
  /** Size variant */
  size: BadgeSize.optional(),
  /** Inverted color scheme */
  inverted: z.boolean().optional(),
  /** Hide the dot indicator */
  hideIndicator: z.boolean().optional(),
});

export type BadgeProps = z.infer<typeof BadgePropsSchema>;

export const BadgeEntry: ComponentEntry<typeof BadgePropsSchema> = {
  name: "Badge",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: BadgePropsSchema,
  description: "Status badge with optional dot indicator",
  category: "indicators",
  defaults: {
    size: "medium",
  },
  previews: badgePreviews,
  usage:
    "Use Badge for status labels, counts, or tags. Use hideIndicator to show text-only.",
};
