"use client";

import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { DEFAULT_START_HOUR, WEEKDAYS } from "../event-calendar.constants";
import type { CalendarEvent } from "../event-calendar.types";
import {
  chunkIntoWeeks,
  getEventsForDay,
  getSpanningEventsForDay,
  sortEvents,
} from "../event-calendar.utils";

import { DraggableEvent } from "./draggable-event";
import { DroppableCell } from "./droppable-cell";

import styles from "./month-view.module.css";

export interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export const MonthView = ({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: MonthViewProps) => {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weeks = useMemo(() => chunkIntoWeeks(days), [days]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  return (
    <div data-slot="month-view" className={styles["month-view"]}>
      <Group
        data-slot="month-view-weekdays"
        className={styles["month-view-weekdays"]}
        fullwidth
        evenly
      >
        {WEEKDAYS.map((day) => (
          <Text
            key={day}
            data-slot="month-view-weekday"
            shade="accent"
            level={0}
            py={4}
            center
          >
            {day}
          </Text>
        ))}
      </Group>
      <div data-slot="month-view-weeks" className={styles["month-view-weeks"]}>
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            data-slot="month-view-week"
            className={styles["month-view-week"]}
          >
            {week.map((day) => {
              if (!day) return null; // Skip if day is undefined

              const dayEvents = getEventsForDay(events, day);
              const spanningEvents = getSpanningEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const cellId = `month-cell-${day.toISOString()}`;
              const allDayEvents = [...spanningEvents, ...dayEvents];

              return (
                <div
                  key={day.toString()}
                  data-slot="month-view-day"
                  className={styles["month-view-day"]}
                  data-today={isToday(day) || undefined}
                  data-outside-cell={!isCurrentMonth || undefined}
                >
                  <DroppableCell
                    id={cellId}
                    date={day}
                    onClick={() => {
                      const startTime = new Date(day);
                      startTime.setHours(DEFAULT_START_HOUR, 0, 0);
                      onEventCreate(startTime);
                    }}
                    fullwidth
                  >
                    <MonthDay value={format(day, "d")} />
                    <Stack
                      data-slot="month-view-day-content"
                      ax="stretch"
                      fullwidth
                    >
                      {sortEvents(allDayEvents).map((event) => {
                        return (
                          <DraggableEvent
                            key={event.id}
                            event={event}
                            view="month"
                            onClick={(e) => handleEventClick(event, e)}
                          />
                        );
                      })}
                    </Stack>
                  </DroppableCell>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
MonthView.displayName = "MonthView";

const MonthDay = ({ value }: { value: string }) => {
  return (
    <Text
      className={styles["month-view-day-number"]}
      data-slot="month-view-day-number"
      shade="accent"
      level={0}
      bold
    >
      {value}
    </Text>
  );
};
