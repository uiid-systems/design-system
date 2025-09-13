import type { FormProps } from "../types";

export type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
  fullwidth?: boolean;
} & FormProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size">;
