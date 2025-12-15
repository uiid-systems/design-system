"use client";

import { useState } from "react";

import {
  EventCalendarDndProvider,
  MonthView,
  type CalendarEvent,
} from "@uiid/calendars";
import { Card } from "@uiid/cards";
import { Drawer } from "@uiid/overlays";

import { MOCK_EVENTS } from "./MOCK_DATA";

export default function EventCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [currentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    console.log("Create event at:", startTime);
  };

  return (
    <>
      <Card trimmed transparent fullwidth gap={0}>
        <EventCalendarDndProvider onEventUpdate={handleEventUpdate}>
          <MonthView
            currentDate={currentDate}
            events={events}
            onEventSelect={handleEventSelect}
            onEventCreate={handleEventCreate}
          />
        </EventCalendarDndProvider>
      </Card>
      <Drawer
        title={selectedEvent?.title || ""}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      >
        stuff goes here
      </Drawer>
    </>
  );
}
