import type { Meta, StoryObj } from "@storybook/react-vite";

import { ToastProvider, Toaster, EventCalendar } from "@uiid/design-system";
import type { CalendarEvent } from "@uiid/design-system";
import { useState } from "react";

import { MOCK_EVENTS } from "./event-calendar.mocks";

const EventCalendarDemo = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);

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
  tags: ["new"],
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
