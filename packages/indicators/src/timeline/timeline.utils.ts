import type { TimelineStatus } from "./timeline.types";

/** Derive an item's status from its position relative to `activeIndex`. */
export function getItemStatus(
  index: number,
  activeIndex?: number,
): TimelineStatus {
  if (activeIndex === undefined) return "pending";
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  return "pending";
}

/**
 * Whether the connector below an item should read as completed. The segment is
 * "filled" once the step it leads into has been reached.
 */
export function isConnectorActive(index: number, activeIndex?: number): boolean {
  return activeIndex !== undefined && index < activeIndex;
}
