import type { StyleProp } from "../types";

export const layoutPropKeys = ["ax", "ay", "direction"] as const;

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
} satisfies StyleProp<"justifyContent">;

export const ay = {
  property: "alignItems",
  values: ["baseline", "center", "end", "start", "stretch"] as const,
} satisfies StyleProp<"alignItems">;

export const direction = {
  property: "flexDirection",
  values: ["column", "row"],
} satisfies StyleProp<"flexDirection">;

export type LayoutProps = {
  /** Alignment of children along the main axis (justify-content) */
  ax?: (typeof ax.values)[number];
  /** Alignment of children along the cross axis (align-items) */
  ay?: (typeof ay.values)[number];
  /** Flex direction of children */
  direction?: (typeof direction.values)[number];
};
