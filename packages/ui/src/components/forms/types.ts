import type { SlotsProps } from "@uiid/primitives";

export type FormOptionProps = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type FormProps = {
  label?: string;
  description?: React.ReactNode;
  hint?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  validate?: boolean;
  hasError?: boolean;
  /** @todo sniff out dead disabled states per component */
  disabled?: boolean;
} & Partial<Pick<SlotsProps, "before" | "after">>;
