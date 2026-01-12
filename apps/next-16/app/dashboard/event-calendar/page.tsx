"use client";

import { useState } from "react";

import { EventCalendar, type CalendarEvent } from "@uiid/calendars";
import { Card } from "@uiid/cards";
import { Drawer } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import { MOCK_EVENTS } from "./MOCK_DATA";

export default function EventCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
  };

  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Event selected:", event);
    setSelectedEvent(event);
    setOpen(true);
  };

  return (
    <>
      <Card trimmed transparent fullwidth gap={0}>
        <EventCalendar
          events={events}
          onEventUpdate={handleEventUpdate}
          onEventSelect={handleEventSelect}
        />
      </Card>
      <Drawer title="Event Details" open={open} onOpenChange={setOpen}>
        <Text>{selectedEvent?.title}</Text>
      </Drawer>
    </>
  );
}
