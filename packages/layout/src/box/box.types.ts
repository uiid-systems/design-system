import type {
  LayoutProps,
  SpacingProps,
  RenderProp,
  VariantProps,
} from "@uiid/utils";

import type { boxVariants } from "./box.variants";

export type BoxVariants = VariantProps<typeof boxVariants>;

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.Ref<HTMLDivElement>;
  render?: RenderProp;
  style?: React.CSSProperties;
  className?: string;
} & LayoutProps &
  SpacingProps &
  BoxVariants;
