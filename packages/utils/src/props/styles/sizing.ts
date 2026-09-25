import type { Responsive, StyleProp } from "../types";

export const sizingPropKeys = [
  "w",
  "minw",
  "maxw",
  "h",
  "minh",
  "maxh",
] as const;

export const w = {
  property: "width",
} satisfies StyleProp<"width">;

export const minw = {
  property: "minWidth",
} satisfies StyleProp<"minWidth">;

export const maxw = {
  property: "maxWidth",
} satisfies StyleProp<"maxWidth">;

export const h = {
  property: "height",
} satisfies StyleProp<"height">;

export const minh = {
  property: "minHeight",
} satisfies StyleProp<"minHeight">;

export const maxh = {
  property: "maxHeight",
} satisfies StyleProp<"maxHeight">;

export type SizingProps = {
  /** Width, in px */
  w?: Responsive<number>;
  /** Minimum width, in px */
  minw?: Responsive<number>;
  /** Maximum width, in px */
  maxw?: Responsive<number>;
  /** Height, in px */
  h?: Responsive<number>;
  /** Minimum height, in px */
  minh?: Responsive<number>;
  /** Maximum height, in px */
  maxh?: Responsive<number>;
};
