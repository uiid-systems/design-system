import type { SpacingProps, RenderProp, VariantProps } from "@uiid/utils";

import { textVariants } from "./text.variants";

export type TextVariants = VariantProps<typeof textVariants>;

export type TextProps = React.HTMLAttributes<HTMLSpanElement> &
  React.PropsWithChildren<{
    /** Ref to the underlying element */
    ref?: React.Ref<HTMLSpanElement>;
    /** Replace the rendered element, e.g. `render={<h2 />}` */
    render?: RenderProp;
    /** Inline styles merged onto the element */
    style?: React.CSSProperties;
    /** Class names merged onto the element */
    className?: string;
  }> &
  TextVariants &
  SpacingProps;
