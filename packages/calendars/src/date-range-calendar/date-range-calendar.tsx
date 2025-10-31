"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { ConditionalRender, Group, Stack } from "@uiid/layout";

import "../calendars.styles.css";

import type {
  DateRangeCalendarProps,
  DateRangeFilterKey,
} from "./date-range-calendar.types";
import { DATE_RANGE_FILTERS } from "./date-range-calendar.constants";

const DEFAULT_FILTERS: DateRangeFilterKey[] = [
  "last7Days",
  "next7Days",
  "lastMonth",
  "monthToDate",
  "currentMonth",
  "nextMonth",
  "lastYear",
  "yearToDate",
];

export const DateRangeCalendar = ({
  headless = false,
  filters = DEFAULT_FILTERS,
  onSelect,
  defaultMonth,
  selected,
  ...props
}: DateRangeCalendarProps) => {
  const [month, setMonth] = useState(defaultMonth);

  const handleFilterClick = (filterKey: DateRangeFilterKey) => {
    const filter = DATE_RANGE_FILTERS[filterKey];
    onSelect?.(filter.range);
    setMonth(filter.range.from);
  };

  return (
    <ConditionalRender condition={!headless} render={<Card />}>
      <Group gap={4}>
        <DayPicker
          {...props}
          mode="range"
          animate
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={onSelect}
        />

        <Stack gap={2} ax="stretch">
          {filters.map((filterKey: DateRangeFilterKey) => (
            <Button
              key={filterKey}
              size="sm"
              onClick={() => handleFilterClick(filterKey)}
            >
              {DATE_RANGE_FILTERS[filterKey].label}
            </Button>
          ))}
        </Stack>
      </Group>
    </ConditionalRender>
  );
};
DateRangeCalendar.displayName = "DateRangeCalendar";
