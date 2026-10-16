import type { StyleProp } from "../types";
import { keysOf } from "./keys";

export const sizingProps = {
  w: {
    property: "width",
    unit: "px",
  } satisfies StyleProp<"width">,
  minw: {
    property: "minWidth",
    unit: "px",
  } satisfies StyleProp<"minWidth">,
  maxw: {
    property: "maxWidth",
    unit: "px",
  } satisfies StyleProp<"maxWidth">,
  h: {
    property: "height",
    unit: "px",
  } satisfies StyleProp<"height">,
  minh: {
    property: "minHeight",
    unit: "px",
  } satisfies StyleProp<"minHeight">,
  maxh: {
    property: "maxHeight",
    unit: "px",
  } satisfies StyleProp<"maxHeight">,
} satisfies Record<keyof SizingProps, unknown>;

export const sizingPropKeys = keysOf(sizingProps);

export type SizingProps = {
  /** Width, in px */
  w?: number;
  /** Minimum width, in px */
  minw?: number;
  /** Maximum width, in px */
  maxw?: number;
  /** Height, in px */
  h?: number;
  /** Minimum height, in px */
  minh?: number;
  /** Maximum height, in px */
  maxh?: number;
};
