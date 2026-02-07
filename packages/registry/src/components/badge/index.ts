import { z } from "zod";

import { Tone } from "../../shared";
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
  /** Semantic color tone */
  tone: Tone.optional(),
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
  description: "Status badge with optional dot indicator and semantic tones",
  category: "indicators",
  defaults: {
    size: "medium",
  },
  previews: badgePreviews,
  usage:
    "Use Badge for status labels, counts, or tags. Set tone for semantic meaning, hideIndicator to show text-only.",
};
