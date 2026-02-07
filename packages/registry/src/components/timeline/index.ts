import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { timelinePreviews } from "./previews";

/**
 * Timeline orientation values.
 */
export const TimelineOrientation = z.enum(["vertical", "horizontal"]);

/**
 * Timeline direction values.
 */
export const TimelineDirection = z.enum(["ltr", "rtl"]);

/**
 * Timeline item schema for the items prop.
 */
export const TimelineItemSchema = z.object({
  /** Item title */
  title: z.string(),
  /** Item description */
  description: z.string().optional(),
  /** Timestamp or time label */
  time: z.string().optional(),
});

/**
 * Timeline component props schema.
 */
export const TimelinePropsSchema = z.object({
  /** Timeline children (for custom composition) */
  children: z.any().optional(),
  /** Array of timeline items */
  items: z.array(TimelineItemSchema).optional(),
  /** Layout orientation */
  orientation: TimelineOrientation.optional(),
  /** Text direction */
  dir: TimelineDirection.optional(),
  /** Index of the active/current item */
  activeIndex: z.number().optional(),
  /** Props forwarded to each TimelineItem */
  ItemProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to each TimelineDot */
  DotProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to each TimelineConnector */
  ConnectorProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to each TimelineContent */
  ContentProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to each TimelineTitle */
  TitleProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to each TimelineDescription */
  DescriptionProps: z.record(z.string(), z.any()).optional(),
  /** Props forwarded to each TimelineTime */
  TimeProps: z.record(z.string(), z.any()).optional(),
});

export type TimelineProps = z.infer<typeof TimelinePropsSchema>;

export const TimelineEntry: ComponentEntry<typeof TimelinePropsSchema> = {
  name: "Timeline",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: TimelinePropsSchema,
  description:
    "Timeline component for displaying chronological events with active state tracking",
  category: "indicators",
  defaults: {
    orientation: "vertical",
  },
  previews: timelinePreviews,
  usage:
    "Use Timeline for chronological events. Pass items array for simple usage, or children for custom composition. Set activeIndex to highlight current step.",
};
