import { z } from "zod";

import { Tone } from "../../shared";
import type { ComponentEntry } from "../../types";
import { BoxPropsSchema } from "../box";
import { cardPreviews } from "./previews";

/**
 * Card component props schema.
 * Container card with title, description, action, and footer slots.
 */
export const CardPropsSchema = BoxPropsSchema.extend({
  /** Card content */
  children: z.any().optional(),
  /** Card title */
  title: z.any().optional(),
  /** Card description */
  description: z.any().optional(),
  /** Action slot (typically buttons) */
  action: z.any().optional(),
  /** Footer slot */
  footer: z.any().optional(),
  /** Icon component */
  icon: z.any().optional(),
  /** Semantic color tone */
  tone: Tone.optional(),
  /** Inverted color scheme */
  inverted: z.boolean().optional(),
  /** Trimmed padding */
  trimmed: z.boolean().optional(),
  /** Transparent background */
  transparent: z.boolean().optional(),
  /** Ghost style (minimal borders) */
  ghost: z.boolean().optional(),
});

export type CardProps = z.infer<typeof CardPropsSchema>;

export const CardEntry: ComponentEntry<typeof CardPropsSchema> = {
  name: "Card",
  package: "@uiid/cards",
  hasChildren: true,
  propsSchema: CardPropsSchema,
  description:
    "Container card with title, description, icon, action, and footer slots",
  category: "cards",
  defaults: {},
  previews: cardPreviews,
  slots: {
    title: "Card heading, rendered above the body",
    description: "Subheading beneath the title",
    action: "Action buttons, typically top-right",
    footer: "Footer content at the bottom of the card",
    icon: "Icon displayed in the card header",
  },
  usage:
    "Use Card as a content container. Pass title/description as props, children as body. Use tone for semantic color.",
};
