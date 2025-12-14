"use client";

import { useEffect, useMemo, useState } from "react";
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

import { Stack } from "@uiid/layout";
import { Popover } from "@uiid/overlays";
import { Text } from "@uiid/typography";

import {
  EVENT_GAP,
  EVENT_HEIGHT,
  DEFAULT_START_HOUR,
  WEEKDAYS,
} from "../event-calendar.constants";
import { useEventVisibility } from "../hooks";
import type { CalendarEvent } from "../event-calendar.types";
import {
  chunkIntoWeeks,
  getAllEventsForDay,
  getEventDayPosition,
  getEventsForDay,
  getSpanningEventsForDay,
  sortEvents,
} from "../event-calendar.utils";

import { DraggableEvent } from "./draggable-event";
import { DroppableCell } from "./droppable-cell";
import { EventItem } from "./event-item";

import styles from "./month-view.module.css";

interface MonthViewProps {
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
  const [isMounted, setIsMounted] = useState(false);
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

  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EVENT_HEIGHT,
    eventGap: EVENT_GAP,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div data-slot="month-view" className={styles["month-view"]}>
      <div
        data-slot="month-view-weekdays"
        className={styles["month-view-weekdays"]}
      >
        {WEEKDAYS.map((day) => (
          <Text
            data-slot="month-view-weekday"
            shade="accent"
            key={day}
            py={2}
            center
          >
            {day}
          </Text>
        ))}
      </div>
      <div data-slot="month-view-weeks" className={styles["month-view-weeks"]}>
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            data-slot="month-view-week"
            className={styles["month-view-week"]}
          >
            {week.map((day, dayIndex) => {
              if (!day) return null; // Skip if day is undefined

              const dayEvents = getEventsForDay(events, day);
              const spanningEvents = getSpanningEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const cellId = `month-cell-${day.toISOString()}`;
              const allDayEvents = [...spanningEvents, ...dayEvents];
              const allEvents = getAllEventsForDay(events, day);

              const isReferenceCell = weekIndex === 0 && dayIndex === 0;
              const visibleCount = isMounted
                ? getVisibleEventCount(allDayEvents.length)
                : undefined;
              const hasMore =
                visibleCount !== undefined &&
                allDayEvents.length > visibleCount;
              const remainingCount = hasMore
                ? allDayEvents.length - visibleCount
                : 0;

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
                  >
                    <div
                      data-slot="month-view-day-number"
                      className={styles["month-view-day-number"]}
                    >
                      {format(day, "d")}
                    </div>
                    <div
                      ref={isReferenceCell ? contentRef : null}
                      data-slot="month-view-day-content"
                      className={styles["month-view-day-content"]}
                    >
                      {sortEvents(allDayEvents).map((event, index) => {
                        const { isFirstDay, isLastDay } = getEventDayPosition(
                          event,
                          day,
                        );
                        const isHidden =
                          isMounted && visibleCount && index >= visibleCount;

                        if (!visibleCount) return null;

                        if (!isFirstDay) {
                          return (
                            <div
                              key={`spanning-${event.id}-${day.toISOString().slice(0, 10)}`}
                              aria-hidden={isHidden ? "true" : undefined}
                              style={{ display: isHidden ? "none" : "initial" }}
                            >
                              <EventItem
                                view="month"
                                event={event}
                                isFirstDay={isFirstDay}
                                isLastDay={isLastDay}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                <div
                                  aria-hidden={true}
                                  style={{ visibility: "hidden" }}
                                >
                                  {!event.allDay && (
                                    <span>
                                      {format(
                                        new Date(event.start),
                                        "h:mm",
                                      )}{" "}
                                    </span>
                                  )}
                                  {event.title}
                                </div>
                              </EventItem>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={event.id}
                            aria-hidden={isHidden ? "true" : undefined}
                            style={{ display: isHidden ? "none" : "initial" }}
                          >
                            <DraggableEvent
                              event={event}
                              view="month"
                              onClick={(e) => handleEventClick(event, e)}
                              isFirstDay={isFirstDay}
                              isLastDay={isLastDay}
                            />
                          </div>
                        );
                      })}

                      {hasMore && (
                        <Popover
                          title={format(day, "EEE d")}
                          trigger={<span>+ {remainingCount} more</span>}
                          TriggerProps={{ onClick: (e) => e.stopPropagation() }}
                          PopupProps={{
                            style: {
                              "--event-height": `${EVENT_HEIGHT}px`,
                            } as React.CSSProperties,
                          }}
                        >
                          <Stack gap={1}>
                            {sortEvents(allEvents).map((event) => (
                              <EventItem
                                key={event.id}
                                event={event}
                                view="month"
                                onClick={(e) => handleEventClick(event, e)}
                                {...getEventDayPosition(event, day)}
                              />
                            ))}
                          </Stack>
                        </Popover>
                      )}
                    </div>
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
