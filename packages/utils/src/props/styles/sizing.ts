import type { StyleProp } from "../types";
import { keysOf } from "../utils";

const FULL_WIDTH = ["100%", "-webkit-fill-available", "-moz-available"];
const FULL_HEIGHT = ["100%", "-webkit-fill-available"];
const widthKeywords = { full: FULL_WIDTH, screen: ["100svw"] };
const heightKeywords = { full: FULL_HEIGHT, screen: ["100svh"] };

export const sizingProps = {
  w: {
    property: "width",
    keywords: widthKeywords,
    unit: "px",
  } satisfies StyleProp<"width">,
  minw: {
    property: "minWidth",
    keywords: widthKeywords,
    unit: "px",
  } satisfies StyleProp<"minWidth">,
  maxw: {
    property: "maxWidth",
    keywords: widthKeywords,
    unit: "px",
  } satisfies StyleProp<"maxWidth">,
  h: {
    property: "height",
    keywords: heightKeywords,
    unit: "px",
  } satisfies StyleProp<"height">,
  minh: {
    property: "minHeight",
    keywords: heightKeywords,
    unit: "px",
  } satisfies StyleProp<"minHeight">,
  maxh: {
    property: "maxHeight",
    keywords: heightKeywords,
    unit: "px",
  } satisfies StyleProp<"maxHeight">,
} satisfies Record<keyof SizingProps, unknown>;

export const sizingPropKeys = keysOf(sizingProps);

/**
 * Keywords the sizing props take besides pixels. `"full"` fills the container
 * (`100%`, then `-webkit-fill-available`, plus `-moz-available` on width,
 * where supported). `"screen"` is the small viewport (`100svw`/`100svh`): the
 * height with mobile browser chrome showing, so it never sits under a toolbar
 * or resizes while the page scrolls. `100svw` counts the vertical scrollbar,
 * so on a page that scrolls vertically `w="screen"` overflows sideways.
 */
export type SizingKeyword = "full" | "screen";

export type SizingProps = {
  /** Width, in px or a {@link SizingKeyword} */
  w?: number | SizingKeyword;
  /** Minimum width, in px or a {@link SizingKeyword} */
  minw?: number | SizingKeyword;
  /** Maximum width, in px or a {@link SizingKeyword} */
  maxw?: number | SizingKeyword;
  /** Height, in px or a {@link SizingKeyword} */
  h?: number | SizingKeyword;
  /** Minimum height, in px or a {@link SizingKeyword} */
  minh?: number | SizingKeyword;
  /** Maximum height, in px or a {@link SizingKeyword} */
  maxh?: number | SizingKeyword;
};
