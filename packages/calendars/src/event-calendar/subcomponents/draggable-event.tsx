"use client";

import { useCallback, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { differenceInDays } from "date-fns";

import { useEventCalendarDnd } from "../event-calendar.context";
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
  isMultiDay,
  multiDayWidth,
  isFirstDay = true,
  isLastDay = true,
  "aria-hidden": ariaHidden,
}: DraggableEventProps) => {
  const { activeId } = useEventCalendarDnd();
  const elementRef = useRef<HTMLDivElement>(null);
  const [dragHandlePosition, setDragHandlePosition] = useState<Omit<
    DragHandlePosition,
    "data"
  > | null>(null);

  // Check if this is a multi-day event
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const isMultiDayEvent =
    isMultiDay || event.allDay || differenceInDays(eventEnd, eventStart) >= 1;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `${event.id}-${view}`,
      data: {
        event,
        view,
        height: height || elementRef.current?.offsetHeight || null,
        isMultiDay: isMultiDayEvent,
        multiDayWidth: multiDayWidth,
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

  // Don't render if this event is being dragged
  if (isDragging || activeId === `${event.id}-${view}`) {
    return (
      <div ref={setNodeRef} style={{ opacity: 0, height: height || "auto" }} />
    );
  }

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    height: height || "auto",
    width: isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
  };

  return (
    <div ref={mergedRef} style={{ ...style, touchAction: "none" }}>
      <EventItem
        event={event}
        view={view}
        showTime={showTime}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
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
