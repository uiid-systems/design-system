import type { FormProps, FormOptionProps } from "../types";

export type RadioGroupOptionProps = FormOptionProps;

export type RadioGroupProps = {
  options: RadioGroupOptionProps[];
  name: string;
  direction?: "horizontal" | "vertical";
} & FormProps;
