import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { PaletteColor } from "../../shared";
import { timelinePreviews } from "./previews";

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
  /** Palette color for this item's marker and connector */
  color: PaletteColor.optional(),
});

/**
 * Timeline component props schema.
 */
export const TimelinePropsSchema = z.object({
  /** Timeline children (for custom composition) */
  children: z.any().optional(),
  /** Array of timeline items */
  items: z.array(TimelineItemSchema).optional(),
  /** Text direction */
  dir: TimelineDirection.optional(),
  /** Index of the active/current item; earlier items read as completed */
  activeIndex: z.number().optional(),
  /** Palette color for all markers and connectors */
  color: PaletteColor.optional(),
  /** Props forwarded to every TimelineItem (incl. nested MarkerProps, etc.) */
  ItemProps: z.record(z.string(), z.any()).optional(),
});

export type TimelineProps = z.infer<typeof TimelinePropsSchema>;

export const TimelineEntry: ComponentEntry<typeof TimelinePropsSchema> = {
  name: "Timeline",
  package: "@uiid/indicators",
  hasChildren: true,
  propsSchema: TimelinePropsSchema,
  description:
    "Vertical timeline for chronological events with a marker rail and active-step tracking",
  category: "indicators",
  previews: timelinePreviews,
  usage:
    "Use Timeline for chronological events. Pass an `items` array for simple usage, or compose `TimelineItem`s as children. Set `activeIndex` to mark the current step (earlier items render as completed). Each item shows a dot on the rail; pass a `media` node (e.g. an icon or Avatar) to add a prominent leading column to the left of the rail.",
  libs: ["base-ui"],
};
