import type { InputProps } from "../input/input.types";

export type NumberInputProps = {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
} & Omit<InputProps, "type" | "before" | "after">;
