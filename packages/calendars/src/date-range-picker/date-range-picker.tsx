"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

import "../calendars.styles.css";

import type {
  DateRange,
  DateRangePickerProps,
} from "./date-range-picker.types";

export const DateRangePicker = ({
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

  return (
    <DayPicker
      {...props}
      mode="range"
      animate
      month={month}
      onMonthChange={setMonth}
      selected={selected}
      onSelect={handleSelect}
    />
  );
};
DateRangePicker.displayName = "DateRangePicker";
