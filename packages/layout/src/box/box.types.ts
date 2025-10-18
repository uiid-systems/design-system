import type {
  ToggleProps,
  LayoutProps,
  SpacingProps,
  RenderProp,
} from "@uiid/utils";

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLDivElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
  uiid?: string;
} & Pick<ToggleProps, "evenly" | "fullwidth"> &
  LayoutProps &
  SpacingProps;
