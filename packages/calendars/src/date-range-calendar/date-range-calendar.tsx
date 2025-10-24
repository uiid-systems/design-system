"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Group, Stack } from "@uiid/layout";

import styles from "../calendars.module.css";

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
  defaultMonth,
  filters = DEFAULT_FILTERS,
  ...props
}: DateRangeCalendarProps) => {
  const [month, setMonth] = useState(defaultMonth);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleFilterClick = (filterKey: DateRangeFilterKey) => {
    const filter = DATE_RANGE_FILTERS[filterKey];
    setDate(filter.range);
    setMonth(filter.range.from);
  };

  return (
    <Card>
      <Group gap={4}>
        <DayPicker
          mode="range"
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          className={styles["rdp-root"]}
          numberOfMonths={1}
          showOutsideDays
          {...props}
        />

        <Stack gap={2} ax="stretch">
          {filters.map((filterKey) => (
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
    </Card>
  );
};
DateRangeCalendar.displayName = "DateRangeCalendar";
