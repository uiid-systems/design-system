"use client";

import { useState } from "react";

import { EventCalendar, type CalendarEvent } from "@uiid/calendars";
import { Card } from "@uiid/cards";

import { MOCK_EVENTS } from "./MOCK_DATA";

export default function EventCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
  };

  return (
    <Card trimmed transparent fullwidth gap={0}>
      <EventCalendar events={events} onEventUpdate={handleEventUpdate} />
    </Card>
  );
}
