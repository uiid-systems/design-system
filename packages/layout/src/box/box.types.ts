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
  ref?: React.Ref<HTMLDivElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
} & StyleProps &
  BoxVariants;
