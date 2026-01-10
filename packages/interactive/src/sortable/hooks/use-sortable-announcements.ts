import * as React from "react";

import type {
  Announcements,
  ScreenReaderInstructions,
} from "@dnd-kit/core";

export interface UseSortableAnnouncementsOptions {
  /** The total number of items in the sortable list */
  itemCount: number;
  /** Layout orientation for screen reader instructions */
  orientation?: "vertical" | "horizontal" | "mixed";
}

export interface UseSortableAnnouncementsReturn {
  /** Announcements for screen readers during drag operations */
  announcements: Announcements;
  /** Instructions for screen reader users */
  screenReaderInstructions: ScreenReaderInstructions;
}

/**
 * Provides accessible announcements and instructions for sortable lists.
 * Announces item movements, positions, and provides keyboard navigation guidance.
 *
 * @example
 * ```tsx
 * const { announcements, screenReaderInstructions } = useSortableAnnouncements({
 *   itemCount: items.length,
 *   orientation: "vertical",
 * });
 * ```
 */
export function useSortableAnnouncements(
  options: UseSortableAnnouncementsOptions,
): UseSortableAnnouncementsReturn {
  const { itemCount, orientation = "vertical" } = options;

  const announcements: Announcements = React.useMemo(
    () => ({
      onDragStart({ active }) {
        const activeValue = active.id.toString();
        return `Grabbed sortable item "${activeValue}". Current position is ${active.data.current?.sortable.index + 1} of ${itemCount}. Use arrow keys to move, space to drop.`;
      },
      onDragOver({ active, over }) {
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0;
          const activeIndex = active.data.current?.sortable.index ?? 0;
          const moveDirection = overIndex > activeIndex ? "down" : "up";
          const activeValue = active.id.toString();
          return `Sortable item "${activeValue}" moved ${moveDirection} to position ${overIndex + 1} of ${itemCount}.`;
        }
        return "Sortable item is no longer over a droppable area. Press escape to cancel.";
      },
      onDragEnd({ active, over }) {
        const activeValue = active.id.toString();
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0;
          return `Sortable item "${activeValue}" dropped at position ${overIndex + 1} of ${itemCount}.`;
        }
        return `Sortable item "${activeValue}" dropped. No changes were made.`;
      },
      onDragCancel({ active }) {
        const activeIndex = active.data.current?.sortable.index ?? 0;
        const activeValue = active.id.toString();
        return `Sorting cancelled. Sortable item "${activeValue}" returned to position ${activeIndex + 1} of ${itemCount}.`;
      },
      onDragMove({ active, over }) {
        if (over) {
          const overIndex = over.data.current?.sortable.index ?? 0;
          const activeIndex = active.data.current?.sortable.index ?? 0;
          const moveDirection = overIndex > activeIndex ? "down" : "up";
          const activeValue = active.id.toString();
          return `Sortable item "${activeValue}" is moving ${moveDirection} to position ${overIndex + 1} of ${itemCount}.`;
        }
        return "Sortable item is no longer over a droppable area. Press escape to cancel.";
      },
    }),
    [itemCount],
  );

  const screenReaderInstructions: ScreenReaderInstructions = React.useMemo(
    () => ({
      draggable: `
        To pick up a sortable item, press space or enter.
        While dragging, use the ${orientation === "vertical" ? "up and down" : orientation === "horizontal" ? "left and right" : "arrow"} keys to move the item.
        Press space or enter again to drop the item in its new position, or press escape to cancel.
      `,
    }),
    [orientation],
  );

  return {
    announcements,
    screenReaderInstructions,
  };
}
