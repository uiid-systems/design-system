"use client";

import { useState } from "react";
import { addHours, addMonths, format, subMonths } from "date-fns";

import { useToastManager } from "@uiid/overlays";

import { EventCalendarDndProvider } from "./event-calendar.context";
import type { CalendarEvent } from "./event-calendar.types";
import { MonthView, EventCalendarHeader } from "./subcomponents";

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventSelect?: (event: CalendarEvent) => void;
  className?: string;
}

export function EventCalendar({
  events = [],
  // onEventAdd,
  onEventUpdate,
  // onEventDelete,
  onEventSelect,
}: EventCalendarProps) {
  const toast = useToastManager();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const handlePrevious = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventSelect?.(event);
    console.log("Event selected:", selectedEvent); // Debug log
  };

  const handleEventCreate = (startTime: Date) => {
    console.log("Creating new event at:", startTime); // Debug log

    // Snap to 15-minute intervals
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        // Round down to nearest 15 min
        startTime.setMinutes(minutes - remainder);
      } else {
        // Round up to nearest 15 min
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHours(startTime, 1),
      allDay: false,
    };
    setSelectedEvent(newEvent);
  };

  // const handleEventSave = (event: CalendarEvent) => {
  //   if (event.id) {
  //     onEventUpdate?.(event);
  //     // Show toast notification when an event is updated
  //     toast.add({
  //       title: `Event "${event.title}" updated`,
  //       description: format(new Date(event.start), "MMM d, yyyy"),
  //     });
  //   } else {
  //     onEventAdd?.({
  //       ...event,
  //       id: Math.random().toString(36).substring(2, 11),
  //     });
  //     // Show toast notification when an event is added
  //     toast.add({
  //       title: `Event "${event.title}" added`,
  //       description: format(new Date(event.start), "MMM d, yyyy"),
  //     });
  //   }
  //   setIsEventDialogOpen(false);
  //   setSelectedEvent(null);
  // };

  // const handleEventDelete = (eventId: string) => {
  //   const deletedEvent = events.find((e) => e.id === eventId);
  //   onEventDelete?.(eventId);
  //   setIsEventDialogOpen(false);
  //   setSelectedEvent(null);

  //   // Show toast notification when an event is deleted
  //   if (deletedEvent) {
  //     toast.add({
  //       title: `Event "${deletedEvent.title}" deleted`,
  //       description: format(new Date(deletedEvent.start), "MMM d, yyyy"),
  //     });
  //   }
  // };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);

    // Show toast notification when an event is updated via drag and drop
    toast.add({
      title: `"${updatedEvent.title}" moved`,
      description: format(new Date(updatedEvent.start), "MMM d, yyyy"),
    });
  };

  return (
    <EventCalendarDndProvider onEventUpdate={handleEventUpdate}>
      <EventCalendarHeader
        handleToday={handleToday}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        viewTitle={format(currentDate, "MMMM yyyy")}
      />
      <MonthView
        currentDate={currentDate}
        events={events}
        onEventSelect={handleEventSelect}
        onEventCreate={handleEventCreate}
      />
    </EventCalendarDndProvider>
  );
}
