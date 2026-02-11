import type { PropCategory } from "../categories";
import { togglePropKeys } from "../categories";

import { b, bx, bl, br, by, bt, bb, borderPropKeys } from "./border";
import { ax, ay, direction, layoutPropKeys } from "./layout";
import { gap, m, mx, ml, mr, my, mt, mb, p, px, pl, pr, py, pt, pb, spacingPropKeys } from "./spacing";
import { w, minw, maxw, h, minh, maxh, sizingPropKeys } from "./sizing";

export const styleProps = {
  // border
  b, bx, bl, br, by, bt, bb,
  // layout
  ax, ay, direction,
  // spacing
  gap, m, mx, ml, mr, my, mt, mb, p, px, pl, pr, py, pt, pb,
  // sizing
  w, minw, maxw, h, minh, maxh,
};

export const stylePropKeys = Object.keys(
  styleProps,
) as (keyof typeof styleProps)[];

export const stylePropCategories: Record<string, PropCategory> = {
  ...Object.fromEntries(spacingPropKeys.map((k) => [k, "spacing"] as const)),
  ...Object.fromEntries(layoutPropKeys.map((k) => [k, "layout"] as const)),
  ...Object.fromEntries(sizingPropKeys.map((k) => [k, "sizing"] as const)),
  ...Object.fromEntries(borderPropKeys.map((k) => [k, "border"] as const)),
  ...Object.fromEntries(togglePropKeys.map((k) => [k, "toggle"] as const)),
};

export { borderPropKeys } from "./border";
export { layoutPropKeys } from "./layout";
export { spacingPropKeys } from "./spacing";
export { sizingPropKeys } from "./sizing";

export type { BorderProps } from "./border";
export type { LayoutProps } from "./layout";
export type { SpacingProps } from "./spacing";
export type { SizingProps } from "./sizing";
