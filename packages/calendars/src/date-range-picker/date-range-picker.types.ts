import type { DateRange, DayPickerProps } from "react-day-picker";
import type { DATE_RANGE_FILTERS } from "./date-range-picker.constants";

export type DateRangeFilterKey = keyof typeof DATE_RANGE_FILTERS;

export type DateRangePickerProps = Omit<
  Extract<DayPickerProps, { mode?: "range" }>,
  "mode" | "onSelect"
> & {
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
};

export type { DateRange };
