"use client";

import { useId, useReducer, useRef, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import type {
  CalendarEvent,
  DragStartData,
  DropTargetData,
  EventCalendarDndContextType,
} from "./event-calendar.types";
import {
  calculateDropTime,
  calculateUpdatedEventTimes,
  hasDateChanged,
  hasDateTimeChanged,
} from "./event-calendar.utils";
import {
  EventCalendarDndContext,
  initialDragState,
} from "./event-calendar.hooks";

import { EventDragOverlay } from "./subcomponents";

// Props for the provider
interface CalendarDndProviderProps {
  children: ReactNode;
  onEventUpdate: (event: CalendarEvent) => void;
}

// Reducer types
type DragAction =
  | { type: "START_DRAG"; payload: EventCalendarDndContextType }
  | { type: "UPDATE_TIME"; payload: Date }
  | { type: "RESET" };

const dragReducer = (
  state: EventCalendarDndContextType,
  action: DragAction,
): EventCalendarDndContextType => {
  switch (action.type) {
    case "START_DRAG":
      return action.payload;
    case "UPDATE_TIME":
      return { ...state, currentTime: action.payload };
    case "RESET":
      return initialDragState;
  }
};

export const EventCalendarDndProvider = ({
  children,
  onEventUpdate,
}: CalendarDndProviderProps) => {
  const [dragState, dispatch] = useReducer(dragReducer, initialDragState);

  // Store original event dimensions
  const eventDimensions = useRef<{ height: number }>({ height: 0 });

  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      // Require the pointer to move by 5px before activating
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // Generate a stable ID for the DndContext
  const dndContextId = useId();

  const resetDragState = () => dispatch({ type: "RESET" });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Add safety check for data.current
    if (!active.data.current) {
      console.error("Missing data in drag start event", event);
      return;
    }

    const {
      event: calendarEvent,
      view,
      height,
      isMultiDay: eventIsMultiDay,
      multiDayWidth: eventMultiDayWidth,
      dragHandlePosition: eventDragHandlePosition,
    } = active.data.current as DragStartData;

    // Store event height in ref
    if (height) {
      eventDimensions.current.height = height;
    }

    dispatch({
      type: "START_DRAG",
      payload: {
        activeEvent: calendarEvent,
        activeId: active.id,
        activeView: view,
        currentTime: new Date(calendarEvent.start),
        eventHeight: height || null,
        isMultiDay: eventIsMultiDay || false,
        multiDayWidth: eventMultiDayWidth || null,
        dragHandlePosition: eventDragHandlePosition || null,
      },
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    const { activeEvent, activeView, currentTime } = dragState;

    if (!over || !activeEvent || !over.data.current) return;

    const dropData = over.data.current as DropTargetData;
    const isMonthView = activeView === "month";
    const newTime = calculateDropTime(dropData, currentTime, isMonthView);

    // Only dispatch if time has actually changed
    const hasChanged = isMonthView
      ? !currentTime || hasDateChanged(newTime, currentTime)
      : !currentTime || hasDateTimeChanged(newTime, currentTime);

    if (hasChanged) {
      dispatch({ type: "UPDATE_TIME", payload: newTime });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const { activeEvent, activeView, currentTime } = dragState;

    // Early exit if missing required data
    if (!over || !activeEvent || !currentTime) {
      resetDragState();
      return;
    }

    try {
      if (!active.data.current || !over.data.current) {
        throw new Error("Missing data in drag event");
      }

      const activeData = active.data.current as Partial<DragStartData>;
      const overData = over.data.current as Partial<DropTargetData>;

      if (!activeData.event || !overData.date) {
        throw new Error("Missing required event data");
      }

      const calendarEvent = activeData.event;
      const isMonthView = activeView === "month";
      const newStart = calculateDropTime(
        overData as DropTargetData,
        currentTime,
        isMonthView,
      );

      // Only update if time has changed
      if (hasDateTimeChanged(new Date(calendarEvent.start), newStart)) {
        const { start, end } = calculateUpdatedEventTimes(
          calendarEvent,
          newStart,
        );
        onEventUpdate({ ...calendarEvent, start, end });
      }
    } catch (error) {
      console.error("Error in drag end handler:", error);
    } finally {
      resetDragState();
    }
  };

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <EventCalendarDndContext.Provider value={dragState}>
        {children}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          <EventDragOverlay {...dragState} />
        </DragOverlay>
      </EventCalendarDndContext.Provider>
    </DndContext>
  );
};
EventCalendarDndProvider.displayName = "EventCalendarDndProvider";
