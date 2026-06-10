import type { SpacingProps, RenderProp } from "@uiid/utils";

export type ProseProps = React.PropsWithChildren<{
  ref?: React.Ref<HTMLDivElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
}> &
  SpacingProps;
