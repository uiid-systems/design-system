import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { addDays, addHours, startOfToday } from "date-fns";

import { MonthView } from "./subcomponents/month-view";
import { EventCalendarDndProvider } from "./event-calendar.context";
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
    id: "3",
    title: "Conference",
    start: addDays(today, 2),
    end: addDays(today, 4),
    allDay: true,
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
    id: "6",
    title: "1:1 with Manager",
    start: addHours(addDays(today, -1), 15),
    end: addHours(addDays(today, -1), 15.5),
  },
];

const MonthViewDemo = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);
  const [currentDate] = useState(new Date());

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
  };

  const handleEventSelect = (event: CalendarEvent) => {
    console.log("Selected event:", event);
  };

  const handleEventCreate = (startTime: Date) => {
    console.log("Create event at:", startTime);
  };

  return (
    <div
      style={
        {
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          // CSS custom properties for event sizing
          "--event-height": "24px",
          "--event-gap": "4px",
        } as React.CSSProperties
      }
    >
      <EventCalendarDndProvider onEventUpdate={handleEventUpdate}>
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventSelect={handleEventSelect}
          onEventCreate={handleEventCreate}
        />
      </EventCalendarDndProvider>
    </div>
  );
};

const meta = {
  title: "Calendars/EventCalendar/MonthView",
  component: MonthViewDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MonthViewDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
