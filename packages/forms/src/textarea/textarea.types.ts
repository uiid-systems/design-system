import type { FormProps } from "../types";

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> &
  FormProps & {
    ref?: React.Ref<HTMLTextAreaElement>;
    fullwidth?: boolean;
    errorMessage?: string;
  };
