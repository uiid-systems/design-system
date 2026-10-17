import type { StyleProp } from "../types";
import { keysOf } from "../utils";

export const borderProps = {
  b: {
    property: "borderWidth",
    unit: "px",
  } satisfies StyleProp<"borderWidth">,
  bx: {
    property: "borderInlineWidth",
    unit: "px",
  } satisfies StyleProp<"borderInlineWidth">,
  bl: {
    property: "borderInlineStartWidth",
    unit: "px",
  } satisfies StyleProp<"borderInlineStartWidth">,
  br: {
    property: "borderInlineEndWidth",
    unit: "px",
  } satisfies StyleProp<"borderInlineEndWidth">,
  by: {
    property: "borderBlockWidth",
    unit: "px",
  } satisfies StyleProp<"borderBlockWidth">,
  bt: {
    property: "borderBlockStartWidth",
    unit: "px",
  } satisfies StyleProp<"borderBlockStartWidth">,
  bb: {
    property: "borderBlockEndWidth",
    unit: "px",
  } satisfies StyleProp<"borderBlockEndWidth">,
} satisfies Record<keyof BorderProps, unknown>;

export const borderPropKeys = keysOf(borderProps);

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
