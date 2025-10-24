"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Group, Stack } from "@uiid/layout";

import styles from "../calendars.module.css";

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
  defaultMonth,
  filters = DEFAULT_FILTERS,
  ...props
}: DateCalendarProps) => {
  const [month, setMonth] = useState(defaultMonth);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleFilterClick = (filterKey: DateFilterKey) => {
    const filter = DATE_FILTERS[filterKey];
    setDate(filter.date);
    setMonth(filter.date);
  };

  return (
    <Card>
      <Group gap={4}>
        <DayPicker
          mode="single"
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
              {DATE_FILTERS[filterKey].label}
            </Button>
          ))}
        </Stack>
      </Group>
    </Card>
  );
};
DateCalendar.displayName = "DateCalendar";
