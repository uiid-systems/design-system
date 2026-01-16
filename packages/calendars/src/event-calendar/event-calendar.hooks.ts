"use client";

import { createContext, useContext } from "react";

import type { EventCalendarDndContextType } from "./event-calendar.types";

// Initial state for drag reducer
export const initialDragState: EventCalendarDndContextType = {
  activeEvent: null,
  activeId: null,
  activeView: null,
  currentTime: null,
  eventHeight: null,
  isMultiDay: false,
  multiDayWidth: null,
  dragHandlePosition: null,
};

// Create the context
export const EventCalendarDndContext =
  createContext<EventCalendarDndContextType>(initialDragState);

// Hook to use the context
export const useEventCalendarDnd = () => useContext(EventCalendarDndContext);
