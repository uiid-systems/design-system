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
} satisfies StyleProp<"borderWidth">;

export const bx = {
  property: "borderInlineWidth",
} satisfies StyleProp<"borderInlineWidth">;

export const bl = {
  property: "borderInlineStartWidth",
} satisfies StyleProp<"borderInlineStartWidth">;

export const br = {
  property: "borderInlineEndWidth",
} satisfies StyleProp<"borderInlineEndWidth">;

export const by = {
  property: "borderBlockWidth",
} satisfies StyleProp<"borderBlockWidth">;

export const bt = {
  property: "borderBlockStartWidth",
} satisfies StyleProp<"borderBlockStartWidth">;

export const bb = {
  property: "borderBlockEndWidth",
} satisfies StyleProp<"borderBlockEndWidth">;

export type BorderProps = {
  b?: number;
  bx?: number;
  by?: number;
  bl?: number;
  br?: number;
  bt?: number;
  bb?: number;
};
