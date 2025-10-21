"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

import { Button } from "@uiid/buttons";
import { Card } from "@uiid/cards";
import { Group, Stack } from "@uiid/layout";

import type { MonthCalendarProps } from "./month-calendar.types";
import styles from "./month-calendar.module.css";
import {
  last7Days,
  lastMonth,
  monthToDate,
  next7Days,
  nextMonth,
  lastYear,
  yearToDate,
  currentMonth,
} from "./month-calendar.constants";

export const MonthCalendar = ({
  defaultMonth,
  ...props
}: MonthCalendarProps) => {
  const [month, setMonth] = useState(defaultMonth);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleLast7Days = () => {
    setDate(last7Days);
    setMonth(last7Days.from);
  };
  const handleNext7Days = () => {
    setDate(next7Days);
    setMonth(next7Days.from);
  };
  const handleLastMonth = () => {
    setDate(lastMonth);
    setMonth(lastMonth.from);
  };
  const handleNextMonth = () => {
    setDate(nextMonth);
    setMonth(nextMonth.from);
  };
  const handleMonthToDate = () => {
    setDate(monthToDate);
    setMonth(monthToDate.from);
  };
  const handleCurrentMonth = () => {
    setDate(currentMonth);
    setMonth(currentMonth.from);
  };
  const handleLastYear = () => {
    setDate(lastYear);
    setMonth(lastYear.from);
  };
  const handleYearToDate = () => {
    setDate(yearToDate);
    setMonth(yearToDate.from);
  };

  return (
    <Card>
      <Group gap={4}>
        <DayPicker
          mode="range"
          month={month}
          onMonthChange={setMonth}
          selected={date as any}
          onSelect={setDate as any}
          className={styles["rdp-root"]}
          numberOfMonths={1}
          showOutsideDays
          {...props}
        />

        <Stack gap={2} ax="stretch">
          <Button size="sm" onClick={handleLast7Days}>
            Last 7 days
          </Button>
          <Button size="sm" onClick={handleNext7Days}>
            Next 7 days
          </Button>
          <Button size="sm" onClick={handleLastMonth}>
            Last month
          </Button>
          <Button size="sm" onClick={handleMonthToDate}>
            Month to date
          </Button>
          <Button size="sm" onClick={handleCurrentMonth}>
            Current month
          </Button>
          <Button size="sm" onClick={handleNextMonth}>
            Next month
          </Button>
          <Button size="sm" onClick={handleLastYear}>
            Last year
          </Button>
          <Button size="sm" onClick={handleYearToDate}>
            Year to date
          </Button>
        </Stack>
      </Group>
    </Card>
  );
};
MonthCalendar.displayName = "MonthCalendar";
