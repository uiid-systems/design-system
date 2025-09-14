import type { SlotsProps } from "../../components/layout";

export type FormProps = {
  label?: string;
  description?: React.ReactNode;
  hint?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  validate?: boolean;
  hasError?: boolean;
} & Partial<Pick<SlotsProps, "before" | "after">>;
