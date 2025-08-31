import type { FormProps } from "../types";

export type CheckboxProps = {
  ref?: React.Ref<HTMLInputElement>;
  indeterminate?: boolean;
} & Omit<FormProps, "size" | "before" | "after"> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children">;
