import { z } from "zod";

import { Shade, SpacingPropsSchema } from "../../shared";
import type { ComponentEntry } from "../../types";
import { separatorPreviews } from "./previews";

/**
 * Separator orientation values.
 */
export const SeparatorOrientation = z.enum(["horizontal", "vertical"]);

/**
 * Separator component props schema.
 * Visual divider with orientation and shade variants, optional children for labeled dividers.
 */
export const SeparatorPropsSchema = SpacingPropsSchema.extend({
  /** Content rendered centered between two lines */
  children: z.any().optional(),
  /** Separator direction */
  orientation: SeparatorOrientation.optional(),
  /** Color shade */
  shade: Shade.optional(),
});

export type SeparatorProps = z.infer<typeof SeparatorPropsSchema>;

export const SeparatorEntry: ComponentEntry<typeof SeparatorPropsSchema> = {
  name: "Separator",
  package: "@uiid/layout",
  hasChildren: true,
  propsSchema: SeparatorPropsSchema,
  description: "Visual divider line with horizontal or vertical orientation",
  category: "layout",
  defaults: {
    orientation: "horizontal",
  },
  previews: separatorPreviews,
  usage:
    "Use without children for a simple line divider. Pass children (typically Text) to create a labeled divider like 'or continue with email'.",
};
