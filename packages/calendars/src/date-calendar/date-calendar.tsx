"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

import { Card } from "@uiid/cards";
import { ConditionalRender, Group } from "@uiid/layout";
import { ToggleGroup, Toggle } from "@uiid/interactive";

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
  selected: selectedProp,
  ...props
}: DateCalendarProps) => {
  const [month, setMonth] = useState(defaultMonth);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedProp,
  );

  // Support both controlled and uncontrolled usage
  const selected = selectedProp !== undefined ? selectedProp : selectedDate;

  const handleSelect = (date: Date | undefined) => {
    if (selectedProp === undefined) {
      setSelectedDate(date);
    }
    onSelect?.(date);
  };

  const handleFilterClick = (filterKey: DateFilterKey) => {
    const filter = DATE_FILTERS[filterKey];
    handleSelect(filter.date);
    setMonth(filter.date);
  };

  return (
    <ConditionalRender condition={!headless} render={<Card />}>
      <Group gap={4} ay="start">
        <DayPicker
          {...props}
          mode="single"
          animate
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={handleSelect}
        />

        {filters.length > 0 && (
          <ToggleGroup defaultValue={["yesterday"]} orientation="vertical">
            {filters.map((filterKey: DateFilterKey) => (
              <Toggle
                key={filterKey}
                onClick={() => handleFilterClick(filterKey)}
                value={filterKey}
              >
                {DATE_FILTERS[filterKey].label}
              </Toggle>
            ))}
          </ToggleGroup>
        )}
      </Group>
    </ConditionalRender>
  );
};
DateCalendar.displayName = "DateCalendar";
