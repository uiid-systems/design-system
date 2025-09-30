import type { FormProps } from "../types";

export type ProgressProps = Omit<
  React.ProgressHTMLAttributes<HTMLProgressElement>,
  "children"
> &
  FormProps & {
    ref?: React.Ref<HTMLProgressElement>;
  };
