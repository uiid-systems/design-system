import type { StyleProp } from "../types";

const SPACING_VALUES = [0, 1, 2, 3, 4, 6, 8, 12, 16] as const;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/gap */
export const gap = {
  property: "gap",
  values: [...SPACING_VALUES],
  scale: { variable: "--scale" },
} satisfies StyleProp<"gap">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin */
export const m = {
  property: "margin",
  values: [...SPACING_VALUES],
  scale: { variable: "--scale" },
} satisfies StyleProp<"margin">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline */
export const mx = {
  property: "marginInline",
  values: m.values,
  scale: { variable: "--scaleInline" },
} satisfies StyleProp<"marginInline">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start */
export const ml = {
  property: "marginInlineStart",
  values: m.values,
  scale: { variable: "--scaleInline" },
} satisfies StyleProp<"marginInlineStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end */
export const mr = {
  property: "marginInlineEnd",
  values: m.values,
  scale: { variable: "--scaleInline" },
} satisfies StyleProp<"marginInlineEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block */
export const my = {
  property: "marginBlock",
  values: m.values,
  scale: { variable: "--scaleBlock" },
} satisfies StyleProp<"marginBlock">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start */
export const mt = {
  property: "marginBlockStart",
  values: m.values,
  scale: { variable: "--scaleBlock" },
} satisfies StyleProp<"marginBlockStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end */
export const mb = {
  property: "marginBlockEnd",
  values: m.values,
  scale: { variable: "--scaleBlock" },
} satisfies StyleProp<"marginBlockEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding */
export const p = {
  property: "padding",
  values: [...SPACING_VALUES],
  scale: { variable: "--scale" },
} satisfies StyleProp<"padding">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline */
export const px = {
  property: "paddingInline",
  values: p.values,
  scale: { variable: "--scaleInline" },
} satisfies StyleProp<"paddingInline">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start */
export const pl = {
  property: "paddingInlineStart",
  values: p.values,
  scale: { variable: "--scaleInline" },
} satisfies StyleProp<"paddingInlineStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end */
export const pr = {
  property: "paddingInlineEnd",
  values: p.values,
  scale: { variable: "--scaleInline" },
} satisfies StyleProp<"paddingInlineEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block */
export const py = {
  property: "paddingBlock",
  values: p.values,
  scale: { variable: "--scaleBlock" },
} satisfies StyleProp<"paddingBlock">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start */
export const pt = {
  property: "paddingBlockStart",
  values: p.values,
  scale: { variable: "--scaleBlock" },
} satisfies StyleProp<"paddingBlockStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end */
export const pb = {
  property: "paddingBlockEnd",
  values: p.values,
  scale: { variable: "--scaleBlock" },
} satisfies StyleProp<"paddingBlockEnd">;

export type SpacingProps = {
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/gap */
  gap?: (typeof gap.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin */
  m?: (typeof m.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline */
  mx?: (typeof mx.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block */
  my?: (typeof my.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start */
  ml?: (typeof ml.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end */
  mr?: (typeof mr.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start */
  mt?: (typeof mt.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end */
  mb?: (typeof mb.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding */
  p?: (typeof p.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline */
  px?: (typeof px.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block */
  py?: (typeof py.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start */
  pl?: (typeof pl.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end */
  pr?: (typeof pr.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start */
  pt?: (typeof pt.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end */
  pb?: (typeof pb.values)[number];
};
