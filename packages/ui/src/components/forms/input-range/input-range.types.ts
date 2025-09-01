import type { InputProps } from "../input/input.types";

export type InputRangeProps = InputProps & {
  min?: number;
  max?: number;
  step?: number;
  tickMarks?: boolean;
};
