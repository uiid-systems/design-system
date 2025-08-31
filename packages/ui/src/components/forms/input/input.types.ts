import type { FormProps } from "../types";

export type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
} & FormProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "size">;
