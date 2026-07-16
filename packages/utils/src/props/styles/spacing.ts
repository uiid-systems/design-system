import type { StyleProp } from "../types";

export const spacingPropKeys = [
  "gap",
  "m",
  "mx",
  "ml",
  "mr",
  "my",
  "mt",
  "mb",
  "p",
  "px",
  "pl",
  "pr",
  "py",
  "pt",
  "pb",
] as const;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/gap */
export const gap = {
  property: "gap",
  unit: { variable: "--spacing-unit" },
} satisfies StyleProp<"gap">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin */
export const m = {
  property: "margin",
  unit: { variable: "--spacing-unit" },
} satisfies StyleProp<"margin">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline */
export const mx = {
  property: "marginInline",
  unit: { variable: "--spacing-inline" },
} satisfies StyleProp<"marginInline">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start */
export const ml = {
  property: "marginInlineStart",
  unit: { variable: "--spacing-inline" },
} satisfies StyleProp<"marginInlineStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end */
export const mr = {
  property: "marginInlineEnd",
  unit: { variable: "--spacing-inline" },
} satisfies StyleProp<"marginInlineEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block */
export const my = {
  property: "marginBlock",
  unit: { variable: "--spacing-block" },
} satisfies StyleProp<"marginBlock">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start */
export const mt = {
  property: "marginBlockStart",
  unit: { variable: "--spacing-block" },
} satisfies StyleProp<"marginBlockStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end */
export const mb = {
  property: "marginBlockEnd",
  unit: { variable: "--spacing-block" },
} satisfies StyleProp<"marginBlockEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding */
export const p = {
  property: "padding",
  unit: { variable: "--spacing-unit" },
} satisfies StyleProp<"padding">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline */
export const px = {
  property: "paddingInline",
  unit: { variable: "--spacing-inline" },
} satisfies StyleProp<"paddingInline">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start */
export const pl = {
  property: "paddingInlineStart",
  unit: { variable: "--spacing-inline" },
} satisfies StyleProp<"paddingInlineStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end */
export const pr = {
  property: "paddingInlineEnd",
  unit: { variable: "--spacing-inline" },
} satisfies StyleProp<"paddingInlineEnd">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block */
export const py = {
  property: "paddingBlock",
  unit: { variable: "--spacing-block" },
} satisfies StyleProp<"paddingBlock">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start */
export const pt = {
  property: "paddingBlockStart",
  unit: { variable: "--spacing-block" },
} satisfies StyleProp<"paddingBlockStart">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end */
export const pb = {
  property: "paddingBlockEnd",
  unit: { variable: "--spacing-block" },
} satisfies StyleProp<"paddingBlockEnd">;

export type SpacingProps = {
  /** Gap between children, in spacing units */
  gap?: number;
  /** Margin on all sides, in spacing units */
  m?: number | "auto";
  /** Margin on the left and right (inline) edges, in spacing units */
  mx?: number | "auto";
  /** Margin on the top and bottom (block) edges, in spacing units */
  my?: number | "auto";
  /** Margin on the left (inline-start) edge, in spacing units */
  ml?: number | "auto";
  /** Margin on the right (inline-end) edge, in spacing units */
  mr?: number | "auto";
  /** Margin on the top (block-start) edge, in spacing units */
  mt?: number | "auto";
  /** Margin on the bottom (block-end) edge, in spacing units */
  mb?: number | "auto";
  /** Padding on all sides, in spacing units */
  p?: number;
  /** Padding on the left and right (inline) edges, in spacing units */
  px?: number;
  /** Padding on the top and bottom (block) edges, in spacing units */
  py?: number;
  /** Padding on the left (inline-start) edge, in spacing units */
  pl?: number;
  /** Padding on the right (inline-end) edge, in spacing units */
  pr?: number;
  /** Padding on the top (block-start) edge, in spacing units */
  pt?: number;
  /** Padding on the bottom (block-end) edge, in spacing units */
  pb?: number;
};
