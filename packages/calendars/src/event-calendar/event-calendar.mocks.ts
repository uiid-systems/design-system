import { addHours, addDays, startOfToday } from "date-fns";

import type { CalendarEvent } from "./event-calendar.types";

const today = startOfToday();

export const MOCK_EVENTS: CalendarEvent[] = [
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
