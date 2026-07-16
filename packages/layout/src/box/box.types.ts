import type {
  BorderProps,
  LayoutProps,
  SpacingProps,
  SizingProps,
  RenderProp,
  VariantProps,
} from "@uiid/utils";

import type { boxVariants } from "./box.variants";

export type BoxVariants = VariantProps<typeof boxVariants>;

type StyleProps = BorderProps & LayoutProps & SpacingProps & SizingProps;

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  /** Ref to the underlying element */
  ref?: React.Ref<HTMLDivElement>;
  /** Replace the rendered element, e.g. `render={<section />}` */
  render?: RenderProp;
  /** Inline styles merged onto the element */
  style?: React.CSSProperties;
  /** Class names merged onto the element */
  className?: string;
} & StyleProps &
  BoxVariants;
