import type { FormProps } from "../types";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "children" | "size"
> &
  FormProps & {
    ref?: React.Ref<HTMLInputElement>;
    fullwidth?: boolean;
    errorMessage?: string;
  };
