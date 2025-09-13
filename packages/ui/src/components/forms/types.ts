import type { SlotsProps } from "../../components/layout";

export type FormProps = {
  label?: string;
  description?: React.ReactNode;
  name?: string;
  size?: "sm" | "md" | "lg";
  required?: boolean;
  invalid?: boolean;
  validate?: boolean;
} & Partial<Pick<SlotsProps, "before" | "after">>;
