import type { FormProps } from "../types";

export type SelectOptionProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  ref?: React.Ref<HTMLSelectElement>;
  options: SelectOptionProps[];
  placeholder?: string;
} & FormProps &
  Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "children" | "size" | "after"
  >;
