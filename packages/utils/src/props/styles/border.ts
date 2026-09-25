import type { StyleProp } from "../types";

export const borderPropKeys = [
  "b",
  "bx",
  "bl",
  "br",
  "by",
  "bt",
  "bb",
] as const;

export const b = {
  property: "borderWidth",
  unit: "px",
} satisfies StyleProp<"borderWidth">;

export const bx = {
  property: "borderInlineWidth",
  unit: "px",
} satisfies StyleProp<"borderInlineWidth">;

export const bl = {
  property: "borderInlineStartWidth",
  unit: "px",
} satisfies StyleProp<"borderInlineStartWidth">;

export const br = {
  property: "borderInlineEndWidth",
  unit: "px",
} satisfies StyleProp<"borderInlineEndWidth">;

export const by = {
  property: "borderBlockWidth",
  unit: "px",
} satisfies StyleProp<"borderBlockWidth">;

export const bt = {
  property: "borderBlockStartWidth",
  unit: "px",
} satisfies StyleProp<"borderBlockStartWidth">;

export const bb = {
  property: "borderBlockEndWidth",
  unit: "px",
} satisfies StyleProp<"borderBlockEndWidth">;

export type BorderProps = {
  /** Border width on all sides, in px */
  b?: number;
  /** Border width on the left and right (inline) edges, in px */
  bx?: number;
  /** Border width on the top and bottom (block) edges, in px */
  by?: number;
  /** Border width on the left (inline-start) edge, in px */
  bl?: number;
  /** Border width on the right (inline-end) edge, in px */
  br?: number;
  /** Border width on the top (block-start) edge, in px */
  bt?: number;
  /** Border width on the bottom (block-end) edge, in px */
  bb?: number;
};
