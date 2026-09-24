import { b, bx, bl, br, by, bt, bb } from "./border";
import { ax, ay, direction } from "./layout";
import { w, minw, maxw, h, minh, maxh } from "./sizing";
import {
  gap,
  m,
  mx,
  ml,
  mr,
  my,
  mt,
  mb,
  p,
  px,
  pl,
  pr,
  py,
  pt,
  pb,
} from "./spacing";

export const styleProps = {
  // border
  b,
  bx,
  bl,
  br,
  by,
  bt,
  bb,
  // layout
  ax,
  ay,
  direction,
  // spacing
  gap,
  m,
  mx,
  ml,
  mr,
  my,
  mt,
  mb,
  p,
  px,
  pl,
  pr,
  py,
  pt,
  pb,
  // sizing
  w,
  minw,
  maxw,
  h,
  minh,
  maxh,
};

export const stylePropKeys = Object.keys(
  styleProps,
) as (keyof typeof styleProps)[];

export { borderPropKeys } from "./border";
export { layoutPropKeys } from "./layout";
export { spacingPropKeys } from "./spacing";
export { sizingPropKeys } from "./sizing";

export type { BorderProps } from "./border";
export type { LayoutProps } from "./layout";
export type { SpacingProps } from "./spacing";
export type { SizingProps } from "./sizing";
