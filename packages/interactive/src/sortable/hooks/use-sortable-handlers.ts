import * as React from "react";

import type {
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";

import { arrayMove } from "@dnd-kit/sortable";

export interface UseSortableHandlersOptions<T> {
  /** The array of items being sorted */
  value: T[];
  /** Callback to update the sorted items */
  onValueChange?: (items: T[]) => void;
  /** Custom move handler with indices */
  onMove?: (
    event: DragEndEvent & { activeIndex: number; overIndex: number },
  ) => void;
  /** Function to get the unique identifier from an item */
  getItemValue: (item: T) => UniqueIdentifier;
  /** External onDragStart handler */
  onDragStart?: (event: DragStartEvent) => void;
  /** External onDragEnd handler */
  onDragEnd?: (event: DragEndEvent) => void;
  /** External onDragCancel handler */
  onDragCancel?: (event: DragEndEvent) => void;
}

export interface UseSortableHandlersReturn {
  /** The currently active (dragging) item id */
  activeId: UniqueIdentifier | null;
  /** Set the active item id */
  setActiveId: (id: UniqueIdentifier | null) => void;
  /** Handler for drag start events */
  handleDragStart: (event: DragStartEvent) => void;
  /** Handler for drag end events */
  handleDragEnd: (event: DragEndEvent) => void;
  /** Handler for drag cancel events */
  handleDragCancel: (event: DragEndEvent) => void;
}

/**
 * Manages drag event handlers and active item state for sortable lists.
 * Handles the logic for reordering items when drag operations complete.
 *
 * @example
 * ```tsx
 * const { activeId, handleDragStart, handleDragEnd, handleDragCancel } =
 *   useSortableHandlers({
 *     value: items,
 *     onValueChange: setItems,
 *     getItemValue: (item) => item.id,
 *   });
 * ```
 */
export function useSortableHandlers<T>(
  options: UseSortableHandlersOptions<T>,
): UseSortableHandlersReturn {
  const {
    value,
    onValueChange,
    onMove,
    getItemValue,
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = options;

  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);

  const handleDragStart = React.useCallback(
    (event: DragStartEvent) => {
      onDragStart?.(event);

      if (event.activatorEvent.defaultPrevented) return;

      setActiveId(event.active.id);
    },
    [onDragStart],
  );

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      onDragEnd?.(event);

      if (event.activatorEvent.defaultPrevented) return;

      const { active, over } = event;
      if (over && active.id !== over?.id) {
        const activeIndex = value.findIndex(
          (item) => getItemValue(item) === active.id,
        );
        const overIndex = value.findIndex(
          (item) => getItemValue(item) === over.id,
        );

        if (onMove) {
          onMove({ ...event, activeIndex, overIndex });
        } else {
          onValueChange?.(arrayMove(value, activeIndex, overIndex));
        }
      }
      setActiveId(null);
    },
    [value, onValueChange, onMove, getItemValue, onDragEnd],
  );

  const handleDragCancel = React.useCallback(
    (event: DragEndEvent) => {
      onDragCancel?.(event);

      if (event.activatorEvent.defaultPrevented) return;

      setActiveId(null);
    },
    [onDragCancel],
  );

  return {
    activeId,
    setActiveId,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
