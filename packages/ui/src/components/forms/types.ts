import type { SlotsProps } from "../../components/layout";

export type FormProps = {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  validate?: boolean;
  name?: string;
  /** Label text above the input field */
  label?: string;
  /** Description text below the input field */
  description?: React.ReactNode;
  /** While true, displays an asterisk after the label */
  required?: boolean;
} & Partial<Pick<SlotsProps, "before" | "after">>;
