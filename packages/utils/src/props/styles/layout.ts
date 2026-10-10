import type { StyleProp } from "../types";

export const layoutPropKeys = ["ax", "ay", "direction", "flex"] as const;

export const ax = {
  property: "justifyContent",
  values: [
    "center",
    "end",
    "normal",
    "space-around",
    "space-between",
    "space-evenly",
    "start",
    "stretch",
  ] as const,
  unit: "none",
} satisfies StyleProp<"justifyContent">;

export const ay = {
  property: "alignItems",
  values: ["baseline", "center", "end", "start", "stretch"] as const,
  unit: "none",
} satisfies StyleProp<"alignItems">;

export const direction = {
  property: "flexDirection",
  values: ["column", "row"],
  unit: "none",
} satisfies StyleProp<"flexDirection">;

/**
 * The `flex` shorthand on the element itself, for sizing it against its
 * siblings. A number is a grow ratio with a zero basis, so `flex={2}` takes
 * twice the space of a `flex={1}` sibling. `"auto"` grows and shrinks from
 * the content size; `"none"` pins the element at its content size.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex
 */
export const flex = {
  property: "flex",
  unit: "none",
} satisfies StyleProp<"flex">;

export type LayoutProps = {
  /** Alignment of children along the main axis (justify-content) */
  ax?: (typeof ax.values)[number];
  /** Alignment of children along the cross axis (align-items) */
  ay?: (typeof ay.values)[number];
  /** Flex direction of children */
  direction?: (typeof direction.values)[number];
  /**
   * Share of the parent's free space, relative to siblings (`flex` shorthand).
   * A number is a grow ratio from a zero basis; `"auto"` sizes from content
   * and flexes; `"none"` sizes from content and does not flex.
   */
  flex?: number | "auto" | "none";
};
