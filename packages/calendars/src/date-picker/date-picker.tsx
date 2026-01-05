"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";

import "../calendars.styles.css";

import type { DatePickerProps } from "./date-picker.types";

export const DatePicker = ({
  onSelect,
  defaultMonth,
  selected: selectedProp,
  ...props
}: DatePickerProps) => {
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

  return (
    <DayPicker
      {...props}
      mode="single"
      animate
      month={month}
      onMonthChange={setMonth}
      selected={selected}
      onSelect={handleSelect}
    />
  );
};
DatePicker.displayName = "DatePicker";
