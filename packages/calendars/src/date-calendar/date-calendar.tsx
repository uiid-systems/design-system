"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { ConditionalRender, Group, Stack } from "@uiid/layout";

import "../calendars.styles.css";

import type { DateCalendarProps, DateFilterKey } from "./date-calendar.types";
import { DATE_FILTERS } from "./date-calendar.constants";

const DEFAULT_FILTERS: DateFilterKey[] = [
  "yesterday",
  "tomorrow",
  "oneWeekAgo",
  "oneWeekFromNow",
  "firstDayOfMonth",
  "lastDayOfMonth",
];

export const DateCalendar = ({
  headless = false,
  filters = DEFAULT_FILTERS,
  onSelect,
  defaultMonth,
  selected,
  ...props
}: DateCalendarProps) => {
  const [month, setMonth] = useState(defaultMonth);

  const handleFilterClick = (filterKey: DateFilterKey) => {
    const filter = DATE_FILTERS[filterKey];
    onSelect?.(filter.date);
    setMonth(filter.date);
  };

  return (
    <ConditionalRender condition={!headless} render={<Card />}>
      <Group gap={4}>
        <DayPicker
          {...props}
          mode="single"
          animate
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={onSelect}
        />

        <Stack gap={2} ax="stretch">
          {filters.map((filterKey: DateFilterKey) => (
            <Button
              key={filterKey}
              size="sm"
              onClick={() => handleFilterClick(filterKey)}
            >
              {DATE_FILTERS[filterKey].label}
            </Button>
          ))}
        </Stack>
      </Group>
    </ConditionalRender>
  );
};
DateCalendar.displayName = "DateCalendar";
