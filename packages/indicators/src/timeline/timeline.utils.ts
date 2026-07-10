import type {
  TimelineItemProps,
  TimelineItemType,
  TimelineSlotProps,
  TimelineStatus,
} from "./timeline.types";

/**
 * Derive an item's status from its position relative to `activeIndex`. When
 * there is no `activeIndex` (the timeline isn't a stepper), every item takes
 * `defaultStatus`.
 */
export function getItemStatus(
  index: number,
  activeIndex?: number,
  defaultStatus: TimelineStatus = "pending",
): TimelineStatus {
  if (activeIndex === undefined) return defaultStatus;
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  return "pending";
}

const SLOT_KEYS = [
  "MediaProps",
  "MarkerProps",
  "ConnectorProps",
  "ContentProps",
  "CardProps",
  "TitleProps",
  "TimeProps",
  "DescriptionProps",
  "HeadingProps",
] as const;

/**
 * Merge the root-level slot props with one data-mode item. Item values win;
 * slot props (`TitleProps`, `MarkerProps`, …) merge key-by-key so a per-item
 * override doesn't discard the timeline-wide defaults.
 */
export function mergeItemProps(
  base: TimelineSlotProps,
  item: TimelineItemType,
): TimelineItemProps {
  // Assembled as a plain record — assigning through a union-indexed slot key
  // would otherwise collapse the individual slot prop types.
  const merged: Record<string, unknown> = { ...base, ...item };
  for (const key of SLOT_KEYS) {
    const baseSlot = base?.[key];
    const itemSlot = item[key];
    if (baseSlot && itemSlot) {
      merged[key] = { ...baseSlot, ...itemSlot };
    }
  }
  return merged as TimelineItemProps;
}
