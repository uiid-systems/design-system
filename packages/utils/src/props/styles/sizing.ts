import type { StyleProp } from "../types";

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/width */
export const w = {
  property: "width",
} satisfies StyleProp<"width">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/min-width */
export const minw = {
  property: "minWidth",
} satisfies StyleProp<"minWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/max-width */
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
  w?: number;
  minw?: number;
  maxw?: number;
  h?: number;
  minh?: number;
  maxh?: number;
};
