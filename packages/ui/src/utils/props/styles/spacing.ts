import type { StyleProp } from "../types";

const SPACING_VALUES = [0, 1, 2, 3, 4, 6, 8, 12, 16];

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin
 * */
export const m = {
  property: "margin",
  values: [...SPACING_VALUES] as const,
  scale: { variable: "--spacing_scale" },
} satisfies StyleProp<"margin">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline
 * */
export const mx = {
  property: "marginInline",
  values: m.values,
  scale: { variable: "--spacing_scale_inline" },
} satisfies StyleProp<"marginInline">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start
 * */
export const ml = {
  property: "marginInlineStart",
  values: m.values,
  scale: { variable: "--spacing_scale_inline" },
} satisfies StyleProp<"marginInlineStart">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end
 * */
export const mr = {
  property: "marginInlineEnd",
  values: m.values,
  scale: { variable: "--spacing_scale_inline" },
} satisfies StyleProp<"marginInlineEnd">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block
 * */
export const my = {
  property: "marginBlock",
  values: m.values,
  scale: { variable: "--spacing_scale_block" },
} satisfies StyleProp<"marginBlock">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start
 * */
export const mt = {
  property: "marginBlockStart",
  values: m.values,
  scale: { variable: "--spacing_scale_block" },
} satisfies StyleProp<"marginBlockStart">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end
 * */
export const mb = {
  property: "marginBlockEnd",
  values: m.values,
  scale: { variable: "--spacing_scale_block" },
} satisfies StyleProp<"marginBlockEnd">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding
 * */
export const p = {
  property: "padding",
  values: [0, 1, 2, 3, 4, 5, 6, 7, 8] as const,
  scale: { variable: "--spacing_scale" },
} satisfies StyleProp<"padding">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline
 * */
export const px = {
  property: "paddingInline",
  values: p.values,
  scale: { variable: "--spacing_scale_inline" },
} satisfies StyleProp<"paddingInline">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start
 * */
export const pl = {
  property: "paddingInlineStart",
  values: p.values,
  scale: { variable: "--spacing_scale_inline" },
} satisfies StyleProp<"paddingInlineStart">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end
 * */
export const pr = {
  property: "paddingInlineEnd",
  values: p.values,
  scale: { variable: "--spacing_scale_inline" },
} satisfies StyleProp<"paddingInlineEnd">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block
 * */
export const py = {
  property: "paddingBlock",
  values: p.values,
  scale: { variable: "--spacing_scale_block" },
} satisfies StyleProp<"paddingBlock">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start
 * */
export const pt = {
  property: "paddingBlockStart",
  values: p.values,
  scale: { variable: "--spacing_scale_block" },
} satisfies StyleProp<"paddingBlockStart">;

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end
 * */
export const pb = {
  property: "paddingBlockEnd",
  values: p.values,
  scale: { variable: "--spacing_scale_block" },
} satisfies StyleProp<"paddingBlockEnd">;
