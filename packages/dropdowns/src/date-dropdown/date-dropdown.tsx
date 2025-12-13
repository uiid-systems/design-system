"use client";

import { useState } from "react";

import { DatePicker, formatDate } from "@uiid/calendars";
import { Calendar } from "@uiid/icons";

import { Dropdown } from "../dropdown/dropdown";

import type { DateDropdownProps } from "./date-dropdown.types";

const formatMap = {
  short: "MM/dd/yyyy",
  medium: "MMM d, yyyy",
  long: "MMMM d, yyyy",
};

export const DateDropdown = ({
  placeholder = "Select a date",
  format = "medium",
  ...props
}: DateDropdownProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [triggerText, setTriggerText] = useState(placeholder);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setTriggerText(formatDate(date, formatMap[format]));
    }
  };

  return (
    <Dropdown
      {...props}
      placeholder={triggerText}
      TriggerProps={{
        icon: <Calendar />,
        iconPosition: "after",
      }}
    >
      <DatePicker
        headless
        selected={selectedDate}
        onSelect={handleDateSelect}
      />
    </Dropdown>
  );
};
DateDropdown.displayName = "DateDropdown";
