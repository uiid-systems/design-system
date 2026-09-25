import type { StyleProp } from "../types";

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
  unit: "px",
} satisfies StyleProp<"width">;

export const minw = {
  property: "minWidth",
  unit: "px",
} satisfies StyleProp<"minWidth">;

export const maxw = {
  property: "maxWidth",
  unit: "px",
} satisfies StyleProp<"maxWidth">;

export const h = {
  property: "height",
  unit: "px",
} satisfies StyleProp<"height">;

export const minh = {
  property: "minHeight",
  unit: "px",
} satisfies StyleProp<"minHeight">;

export const maxh = {
  property: "maxHeight",
  unit: "px",
} satisfies StyleProp<"maxHeight">;

export type SizingProps = {
  /** Width, in px */
  w?: number;
  /** Minimum width, in px */
  minw?: number;
  /** Maximum width, in px */
  maxw?: number;
  /** Height, in px */
  h?: number;
  /** Minimum height, in px */
  minh?: number;
  /** Maximum height, in px */
  maxh?: number;
};
