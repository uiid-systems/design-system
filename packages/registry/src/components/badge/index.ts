import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { PaletteColor } from "../../shared";
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
  /** Palette color for tinted badge */
  color: PaletteColor.optional(),
});

export type BadgeProps = z.infer<typeof BadgePropsSchema>;

export const BadgeEntry: ComponentEntry<typeof BadgePropsSchema> = {
  name: "Badge",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: BadgePropsSchema,
  description: "Status badge for labels, counts, or tags",
  category: "indicators",
  defaults: {
    size: "medium",
  },
  previews: badgePreviews,
  usage: "Use Badge for status labels, counts, or tags.",
};
