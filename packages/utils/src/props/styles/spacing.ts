import type { StyleProp } from "../types";
import { keysOf } from "./keys";

export const spacingProps = {
  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/gap */
  gap: {
    property: "gap",
    unit: { variable: "--spacing-unit" },
  } satisfies StyleProp<"gap">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin */
  m: {
    property: "margin",
    keywords: ["auto"],
    unit: { variable: "--spacing-unit" },
  } satisfies StyleProp<"margin">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline */
  mx: {
    property: "marginInline",
    keywords: ["auto"],
    unit: { variable: "--spacing-inline" },
  } satisfies StyleProp<"marginInline">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start */
  ml: {
    property: "marginInlineStart",
    keywords: ["auto"],
    unit: { variable: "--spacing-inline" },
  } satisfies StyleProp<"marginInlineStart">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end */
  mr: {
    property: "marginInlineEnd",
    keywords: ["auto"],
    unit: { variable: "--spacing-inline" },
  } satisfies StyleProp<"marginInlineEnd">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block */
  my: {
    property: "marginBlock",
    keywords: ["auto"],
    unit: { variable: "--spacing-block" },
  } satisfies StyleProp<"marginBlock">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start */
  mt: {
    property: "marginBlockStart",
    keywords: ["auto"],
    unit: { variable: "--spacing-block" },
  } satisfies StyleProp<"marginBlockStart">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end */
  mb: {
    property: "marginBlockEnd",
    keywords: ["auto"],
    unit: { variable: "--spacing-block" },
  } satisfies StyleProp<"marginBlockEnd">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding */
  p: {
    property: "padding",
    unit: { variable: "--spacing-unit" },
  } satisfies StyleProp<"padding">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline */
  px: {
    property: "paddingInline",
    unit: { variable: "--spacing-inline" },
  } satisfies StyleProp<"paddingInline">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start */
  pl: {
    property: "paddingInlineStart",
    unit: { variable: "--spacing-inline" },
  } satisfies StyleProp<"paddingInlineStart">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end */
  pr: {
    property: "paddingInlineEnd",
    unit: { variable: "--spacing-inline" },
  } satisfies StyleProp<"paddingInlineEnd">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block */
  py: {
    property: "paddingBlock",
    unit: { variable: "--spacing-block" },
  } satisfies StyleProp<"paddingBlock">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start */
  pt: {
    property: "paddingBlockStart",
    unit: { variable: "--spacing-block" },
  } satisfies StyleProp<"paddingBlockStart">,

  /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end */
  pb: {
    property: "paddingBlockEnd",
    unit: { variable: "--spacing-block" },
  } satisfies StyleProp<"paddingBlockEnd">,
} satisfies Record<keyof SpacingProps, unknown>;

export const spacingPropKeys = keysOf(spacingProps);

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
