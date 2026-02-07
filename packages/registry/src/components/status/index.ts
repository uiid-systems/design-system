import { z } from "zod";

import { Tone } from "../../shared";
import type { ComponentEntry } from "../../types";
import { statusPreviews } from "./previews";

/**
 * Status component props schema.
 */
export const StatusPropsSchema = z.object({
  /** Status label (optional) */
  children: z.any().optional(),
  /** Semantic color tone */
  tone: Tone.optional(),
  /** Animate with pulsing effect */
  pulse: z.boolean().optional(),
  /** Inverted color scheme */
  inverted: z.boolean().optional(),
});

export type StatusProps = z.infer<typeof StatusPropsSchema>;

export const StatusEntry: ComponentEntry<typeof StatusPropsSchema> = {
  name: "Status",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: StatusPropsSchema,
  description: "Status dot indicator with optional label and pulsing animation",
  category: "indicators",
  defaults: {},
  previews: statusPreviews,
  usage:
    "Use Status for online/offline indicators or activity states. Set pulse for live activity, tone for semantic meaning.",
};
