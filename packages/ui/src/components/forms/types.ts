import type { SlotsProps } from "../../components/layout";

export type FormProps = {
  /** The name of the form field */
  name?: string;
  /** A predefined size for the form field */
  size?: "sm" | "md" | "lg";
  /** While true, displays an asterisk after the label */
  required?: boolean;
  /** While true, the form field is invalid */
  invalid?: boolean;
  /** While true, the form field will show styles for validation */
  validate?: boolean;
  /** Label text above the input field */
  label?: string;
  /** Description text below the input field */
  description?: React.ReactNode;
} & Partial<Pick<SlotsProps, "before" | "after">>;
