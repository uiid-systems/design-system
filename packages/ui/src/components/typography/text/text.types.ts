import type { UiProps } from "../../../types";

export type TextProps = React.PropsWithChildren<{
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  ref?: React.Ref<HTMLSpanElement>;
}> &
  UiProps;
