import type { EventItemProps } from "../event-calendar.types";

import { AgendaEvent } from "./agenda-event";
import { MonthEvent } from "./month-event";
import { WeekDayEvent } from "./week-day-event";

export const EventItem = ({ view, showTime, ...props }: EventItemProps) => {
  switch (view) {
    case "month":
      return <MonthEvent {...props} />;
    case "week":
    case "day":
      return <WeekDayEvent view={view} showTime={showTime} {...props} />;
    case "agenda":
      return <AgendaEvent {...props} />;
  }
};
EventItem.displayName = "EventItem";
