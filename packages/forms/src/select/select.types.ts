import type { FormProps, FormOptionProps } from "../types";

export type SelectOptionProps = FormOptionProps;

export type SelectProps = {
  ref?: React.Ref<HTMLSelectElement>;
  options: SelectOptionProps[];
  placeholder?: string;
} & FormProps &
  Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "children" | "size" | "after"
  >;
