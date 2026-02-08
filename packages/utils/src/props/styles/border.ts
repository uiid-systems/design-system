import type { StyleProp } from "../types";

export const borderPropKeys = ["b", "bx", "bl", "br", "by", "bt", "bb"] as const;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-width */
export const b = {
  property: "borderWidth",
} satisfies StyleProp<"borderWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-width */
export const bx = {
  property: "borderInlineWidth",
} satisfies StyleProp<"borderInlineWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-width */
export const bl = {
  property: "borderInlineStartWidth",
} satisfies StyleProp<"borderInlineStartWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-width */
export const br = {
  property: "borderInlineEndWidth",
} satisfies StyleProp<"borderInlineEndWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-width */
export const by = {
  property: "borderBlockWidth",
} satisfies StyleProp<"borderBlockWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-start-width */
export const bt = {
  property: "borderBlockStartWidth",
} satisfies StyleProp<"borderBlockStartWidth">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-end-width */
export const bb = {
  property: "borderBlockEndWidth",
} satisfies StyleProp<"borderBlockEndWidth">;

export type BorderProps = {
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-width */
  b?: number;
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-width */
  bx?: number;
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-width */
  by?: number;
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-width */
  bl?: number;
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-width */
  br?: number;
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-start-width */
  bt?: number;
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-end-width */
  bb?: number;
};
