import type { InputProps } from "../input/input.types";

export type InputDatetimeProps = Omit<InputProps, "type"> & {
  type: "datetime-local" | "date" | "time";
};
