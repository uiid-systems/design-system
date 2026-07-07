import type { SpacingProps, RenderProp, VariantProps } from "@uiid/utils";

import { textVariants } from "./text.variants";

export type TextVariants = VariantProps<typeof textVariants>;

export type TextProps = React.HTMLAttributes<HTMLSpanElement> &
  React.PropsWithChildren<{
    ref?: React.Ref<HTMLSpanElement>;
    render?: RenderProp;
    style?: React.CSSProperties;
    className?: string;
  }> &
  TextVariants &
  SpacingProps;
