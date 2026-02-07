import { z } from "zod";

import { Tone } from "../../shared";
import type { ComponentEntry } from "../../types";
import { alertPreviews } from "./previews";

/**
 * Alert component props schema.
 * Extends Card props for consistent structure.
 */
export const AlertPropsSchema = z.object({
  /** Alert content */
  children: z.any().optional(),
  /** Alert title */
  title: z.any().optional(),
  /** Alert description */
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

export type AlertProps = z.infer<typeof AlertPropsSchema>;

export const AlertEntry: ComponentEntry<typeof AlertPropsSchema> = {
  name: "Alert",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: AlertPropsSchema,
  description:
    "Semantic alert component for displaying important messages with optional title and actions",
  category: "indicators",
  defaults: {},
  previews: alertPreviews,
  slots: {
    title: "Alert heading",
    description: "Alert message text",
    action: "Action buttons",
    footer: "Footer content",
    icon: "Alert icon",
  },
  usage:
    "Use Alert for important messages. Set tone for semantic meaning (positive, warning, critical, info).",
};
