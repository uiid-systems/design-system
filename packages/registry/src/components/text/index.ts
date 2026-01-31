import { z } from "zod";

import { Shade, SpacingPropsSchema, Tone } from "../../shared";
import type { ComponentEntry } from "../../types";
import { textPreviews } from "./previews";

/**
 * Text size values (typographic scale).
 */
export const TextSize = z.union([
  z.literal(-1),
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);

export type TextSize = z.infer<typeof TextSize>;

/**
 * Text weight values.
 */
export const TextWeight = z.enum(["thin", "light", "normal", "bold"]);

export type TextWeight = z.infer<typeof TextWeight>;

/**
 * Text alignment values.
 */
export const TextAlign = z.enum(["left", "center", "right", "justify"]);

export type TextAlign = z.infer<typeof TextAlign>;

/**
 * Text component props schema.
 */
export const TextPropsSchema = SpacingPropsSchema.extend({
  /** Text content */
  children: z.any().optional(),
  /** Font size from typographic scale (-1 to 8) */
  size: TextSize.optional(),
  /** Font weight */
  weight: TextWeight.optional(),
  /** Color shade */
  shade: Shade.optional(),
  /** Semantic color tone */
  tone: Tone.optional(),
  /** Text alignment */
  align: TextAlign.optional(),
  /** Underline decoration */
  underline: z.boolean().optional(),
  /** Strikethrough decoration */
  strikethrough: z.boolean().optional(),
  /** Balance text wrapping (CSS text-wrap: balance) */
  balance: z.boolean().optional(),
  /** Monospace font */
  mono: z.boolean().optional(),
});

export type TextProps = z.infer<typeof TextPropsSchema>;

export const TextEntry: ComponentEntry<typeof TextPropsSchema> = {
  name: "Text",
  package: "@uiid/typography",
  hasChildren: true,
  propsSchema: TextPropsSchema,
  description:
    "Typography component with size scale, weight, color shades, and text decorations",
  category: "typography",
  defaults: {},
  previews: textPreviews,
};
