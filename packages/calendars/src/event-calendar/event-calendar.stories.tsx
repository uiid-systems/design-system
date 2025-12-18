import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToastProvider, Toaster } from "@uiid/overlays";
import { useState } from "react";
import { addDays, addHours, startOfToday } from "date-fns";

import { EventCalendar } from "./event-calendar";
import type { CalendarEvent } from "./event-calendar.types";

// Sample events for demo
const today = startOfToday();

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Standup",
    start: addHours(today, 9),
    end: addHours(today, 9.5),
  },
  {
    id: "2",
    title: "Design Review",
    start: addHours(today, 14),
    end: addHours(today, 15),
  },
  {
    id: "4",
    title: "Lunch with Client",
    start: addHours(addDays(today, 1), 12),
    end: addHours(addDays(today, 1), 13),
    location: "Downtown Cafe",
  },
  {
    id: "5",
    title: "Sprint Planning",
    start: addHours(addDays(today, 3), 10),
    end: addHours(addDays(today, 3), 12),
  },
  {
    id: "7",
    title: "Sprint Planning",
    start: addHours(addDays(today, 3), 10),
    end: addHours(addDays(today, 3), 12),
  },
  {
    id: "6",
    title: "1:1 with Manager",
    start: addHours(addDays(today, -1), 15),
    end: addHours(addDays(today, -1), 15.5),
  },
];

const EventCalendarDemo = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
};

const meta: Meta<typeof EventCalendarDemo> = {
  title: "Calendars/Event Calendar",
  component: EventCalendarDemo,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "Event Calendar" };
