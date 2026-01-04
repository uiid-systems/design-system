import type { SpacingProps, RenderProp, VariantProps } from "@uiid/utils";

import { textVariants } from "./text.variants";

export type TextVariantProps = VariantProps<typeof textVariants>;

export type TextProps = React.PropsWithChildren<{
  ref?: React.Ref<HTMLSpanElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
}> &
  TextVariantProps &
  SpacingProps;
