import { z } from "zod";

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
