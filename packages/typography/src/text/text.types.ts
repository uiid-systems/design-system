import type { ToggleProps, RenderProp } from "@uiid/utils";

export type TextProps = React.PropsWithChildren<{
  level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  ref?: React.Ref<HTMLSpanElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  uiid?: string;
}> &
  Pick<ToggleProps, "bold">;
