import type { ToggleProps, SpacingProps, RenderProp } from "@uiid/utils";

export type TextVariantProps = {
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  shade?:
    | "foreground"
    | "accent"
    | "halftone"
    | "muted"
    | "surface"
    | "background";
};

export type TextProps = React.PropsWithChildren<{
  ref?: React.Ref<HTMLSpanElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  uiid?: string;
}> &
  TextVariantProps &
  Pick<ToggleProps, "bold"> &
  SpacingProps;
