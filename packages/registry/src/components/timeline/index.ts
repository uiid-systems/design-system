import { z } from "zod";

import type { ComponentEntry } from "../../types";
import { PaletteColor } from "../../shared";
import { timelinePreviews } from "./previews";

/**
 * Timeline direction values.
 */
export const TimelineDirection = z.enum(["ltr", "rtl"]);

/**
 * Timeline item status values.
 */
export const TimelineStatus = z.enum(["completed", "active", "pending"]);

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
  /** Explicit status; overrides activeIndex/defaultStatus derivation */
  status: TimelineStatus.optional(),
  /** Props for this item's Card (e.g. { variant: "ghost" } for a flat row) */
  CardProps: z.record(z.string(), z.any()).optional(),
  /** Node rendered inside the marker on the rail (e.g. a small icon) */
  marker: z.any().optional(),
  /** Prominent leading visual (e.g. an Avatar or icon) left of the rail */
  media: z.any().optional(),
  /** Rich content (e.g. a Card) rendered below the item's text block */
  content: z.any().optional(),
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
  /** Status for items when activeIndex is absent; feeds use "completed" */
  defaultStatus: TimelineStatus.optional(),
  /** Space between items as a spacing token (like Stack's gap) */
  gap: z.number().optional(),
  /** Palette color for all markers and connectors */
  color: PaletteColor.optional(),
  /** li props forwarded to every TimelineItem */
  ItemProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's media wrapper */
  MediaProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's marker */
  MarkerProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's connector */
  ConnectorProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's content column (e.g. maxw) */
  ContentProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's Card (e.g. { variant: "ghost" }) */
  CardProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's title text */
  TitleProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's time text */
  TimeProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's description text */
  DescriptionProps: z.record(z.string(), z.any()).optional(),
  /** Props for every item's title/time heading row */
  HeadingProps: z.record(z.string(), z.any()).optional(),
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
    "Use Timeline for chronological events. Pass an `items` array for simple usage, or compose `TimelineItem`s as children. Every item renders its content in a Card — `title`/`time` fill the card header and `content`/children fill the body; pass `CardProps={{ variant: \"ghost\" }}` (root or per item) for flat rows. For steppers, set `activeIndex` to mark the current step (earlier items render as completed). For feeds of past events, set `defaultStatus=\"completed\"` instead. Pass a `marker` node (small icon) to render inside the rail dot, or a `media` node (icon or Avatar) for a prominent leading column left of the rail. Use `gap` to control the space between items.",
  libs: ["base-ui"],
};
