import { z } from "zod";

import type { ComponentEntry, PreviewConfig } from "../types";

import { BoxPropsSchema } from "./layout";
import { Tone } from "./shared";

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

const cardPreviews: PreviewConfig[] = [
  {
    label: "With slots",
    tree: {
      root: "card",
      elements: {
        card: {
          key: "card",
          type: "Card",
          props: {
            title: "Card Title",
            description: "A short description of this card's content.",
            footer: "Footer content",
          },
          children: ["body"],
        },
        body: { key: "body", type: "Text", props: { children: "Card body content goes here." }, parentKey: "card" },
      },
    },
  },
  {
    label: "Tones",
    tree: {
      root: "group",
      elements: {
        group: { key: "group", type: "Group", props: { gap: 4 }, children: ["neutral", "positive", "critical"] },
        neutral: { key: "neutral", type: "Card", props: { title: "Neutral" }, parentKey: "group" },
        positive: { key: "positive", type: "Card", props: { title: "Positive", tone: "positive" }, parentKey: "group" },
        critical: { key: "critical", type: "Card", props: { title: "Critical", tone: "critical" }, parentKey: "group" },
      },
    },
  },
];

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
  usage: "Use Card as a content container. Pass title/description as props, children as body. Use tone for semantic color.",
};

