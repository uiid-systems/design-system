"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

import { Card } from "@uiid/cards";
import { ConditionalRender, Group } from "@uiid/layout";
import { Toggle, ToggleGroup } from "@uiid/interactive";

import "../calendars.styles.css";

import type {
  DateRange,
  DateRangePickerProps,
  DateRangeFilterKey,
} from "./date-range-picker.types";
import { DATE_RANGE_FILTERS } from "./date-range-picker.constants";

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

export const DateRangePicker = ({
  headless = false,
  filters = DEFAULT_FILTERS,
  onSelect,
  defaultMonth,
  selected: selectedProp,
  ...props
}: DateRangePickerProps) => {
  const [month, setMonth] = useState(defaultMonth);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    selectedProp,
  );

  // Support both controlled and uncontrolled usage
  const selected = selectedProp !== undefined ? selectedProp : selectedRange;

  const handleSelect = (range: DateRange | undefined) => {
    if (selectedProp === undefined) {
      setSelectedRange(range);
    }
    onSelect?.(range);
  };

  const handleFilterClick = (filterKey: DateRangeFilterKey) => {
    const filter = DATE_RANGE_FILTERS[filterKey];
    handleSelect(filter.range);
    setMonth(filter.range.from);
  };

  return (
    <ConditionalRender condition={!headless} render={<Card />}>
      <Group gap={4} ay="start">
        <DayPicker
          {...props}
          mode="range"
          animate
          month={month}
          onMonthChange={setMonth}
          selected={selected}
          onSelect={handleSelect}
        />

        {filters.length > 0 && (
          <ToggleGroup defaultValue={["last7Days"]} orientation="vertical">
            {filters.map((filterKey: DateRangeFilterKey) => (
              <Toggle
                key={filterKey}
                value={filterKey}
                onClick={() => handleFilterClick(filterKey)}
              >
                {DATE_RANGE_FILTERS[filterKey].label}
              </Toggle>
            ))}
          </ToggleGroup>
        )}
      </Group>
    </ConditionalRender>
  );
};
DateRangePicker.displayName = "DateRangePicker";
