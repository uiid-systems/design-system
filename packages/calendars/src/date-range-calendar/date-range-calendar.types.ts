import type { DayPickerProps } from "react-day-picker";
import type { DATE_RANGE_FILTERS } from "./date-range-calendar.constants";

export type DateRangeFilterKey = keyof typeof DATE_RANGE_FILTERS;

export type DateRangeCalendarProps = Omit<DayPickerProps, "mode"> & {
  filters?: DateRangeFilterKey[];
};
