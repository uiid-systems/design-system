"use client";

import { useCallback, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type {
  DragHandlePosition,
  DraggableEventProps,
} from "../event-calendar.types";

import { EventItem } from "./event-item";

export const DraggableEvent = ({
  event,
  view,
  showTime,
  onClick,
  height,
  isFirstDay = true,
  isLastDay = true,
  "aria-hidden": ariaHidden,
}: DraggableEventProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<Omit<
    DragHandlePosition,
    "data"
  > | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${event.id}-${view}`,
      data: {
        event,
        view,
        height: height || elementRef.current?.offsetHeight || null,
        dragHandlePosition,
        isFirstDay,
        isLastDay,
      },
    });

  // Merge dnd-kit's ref with our own ref
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      elementRef.current = node;
    },
    [setNodeRef],
  );

  // Track where on the event the user clicked/touched
  const updateDragHandlePosition = (clientX: number, clientY: number) => {
    if (!elementRef.current) return;
    const rect = elementRef.current.getBoundingClientRect();
    setDragHandlePosition({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) =>
    updateDragHandlePosition(e.clientX, e.clientY);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) updateDragHandlePosition(touch.clientX, touch.clientY);
  };

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    height: height || "auto",
  };

  return (
    <div ref={mergedRef} style={{ ...style, touchAction: "none" }}>
      <EventItem
        event={event}
        view={view}
        showTime={showTime}
        isDragging={isDragging}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        dndListeners={listeners}
        dndAttributes={attributes}
        aria-hidden={ariaHidden}
      />
    </div>
  );
};
DraggableEvent.displayName = "DraggableEvent";
