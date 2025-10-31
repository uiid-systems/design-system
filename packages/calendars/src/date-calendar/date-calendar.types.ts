import type { DayPickerProps } from "react-day-picker";
import type { DATE_FILTERS } from "./date-calendar.constants";

export type DateFilterKey = keyof typeof DATE_FILTERS;

export type DateCalendarProps = Omit<
  Extract<DayPickerProps, { mode?: "single" }>,
  "mode" | "onSelect"
> & {
  filters?: DateFilterKey[];
  headless?: boolean;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};
