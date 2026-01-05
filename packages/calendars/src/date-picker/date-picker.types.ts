import type { DayPickerProps } from "react-day-picker";
import type { DATE_FILTERS } from "./date-picker.constants";

export type DateFilterKey = keyof typeof DATE_FILTERS;

export type DatePickerProps = Omit<
  Extract<DayPickerProps, { mode?: "single" }>,
  "mode" | "onSelect"
> & {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
};
