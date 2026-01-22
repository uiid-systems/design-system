import type { StyleProp } from "../types";

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/gap */
export const gap = {
  property: "gap",
  scale: { variable: "--spacing-scale" },
} satisfies StyleProp<"gap">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin */
export const m = {
  property: "margin",
  scale: { variable: "--spacing-scale" },
} satisfies StyleProp<"margin">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline */
export const mx = {
  property: "marginInline",
  scale: { variable: "--spacing-scaleInline" },
} satisfies StyleProp<"marginInline">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start */
export const ml = {
  property: "marginInlineStart",
  scale: { variable: "--spacing-scaleInline" },
} satisfies StyleProp<"marginInlineStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end */
export const mr = {
  property: "marginInlineEnd",
  scale: { variable: "--spacing-scaleInline" },
} satisfies StyleProp<"marginInlineEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block */
export const my = {
  property: "marginBlock",
  scale: { variable: "--spacing-scaleBlock" },
} satisfies StyleProp<"marginBlock">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start */
export const mt = {
  property: "marginBlockStart",
  scale: { variable: "--spacing-scaleBlock" },
} satisfies StyleProp<"marginBlockStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end */
export const mb = {
  property: "marginBlockEnd",
  scale: { variable: "--spacing-scaleBlock" },
} satisfies StyleProp<"marginBlockEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding */
export const p = {
  property: "padding",
  scale: { variable: "--spacing-scale" },
} satisfies StyleProp<"padding">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline */
export const px = {
  property: "paddingInline",
  scale: { variable: "--spacing-scaleInline" },
} satisfies StyleProp<"paddingInline">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start */
export const pl = {
  property: "paddingInlineStart",
  scale: { variable: "--spacing-scaleInline" },
} satisfies StyleProp<"paddingInlineStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end */
export const pr = {
  property: "paddingInlineEnd",
  scale: { variable: "--spacing-scaleInline" },
} satisfies StyleProp<"paddingInlineEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block */
export const py = {
  property: "paddingBlock",
  scale: { variable: "--spacing-scaleBlock" },
} satisfies StyleProp<"paddingBlock">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start */
export const pt = {
  property: "paddingBlockStart",
  scale: { variable: "--spacing-scaleBlock" },
} satisfies StyleProp<"paddingBlockStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end */
export const pb = {
  property: "paddingBlockEnd",
  scale: { variable: "--spacing-scaleBlock" },
} satisfies StyleProp<"paddingBlockEnd">;

export type SpacingProps = {
  gap?: number;
  m?: number | "auto";
  mx?: number | "auto";
  my?: number | "auto";
  ml?: number | "auto";
  mr?: number | "auto";
  mt?: number | "auto";
  mb?: number | "auto";
  p?: number;
  px?: number;
  py?: number;
  pl?: number;
  pr?: number;
  pt?: number;
  pb?: number;
};
