import type { SlotsProps } from "../../components/layout";
import type { FormFieldProps } from "./subcomponents";

type BaseFormElementProps = {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  validate?: boolean;
} & FormFieldProps &
  Partial<Pick<SlotsProps, "before" | "after">>;

export type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
} & BaseFormElementProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size">;

export type SelectOptionProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  ref?: React.Ref<HTMLSelectElement>;
  options: SelectOptionProps[];
  placeholder?: string;
} & BaseFormElementProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children" | "size">;

export type CheckboxProps = {
  ref?: React.Ref<HTMLInputElement>;
  indeterminate?: boolean;
} & BaseFormElementProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size">;
