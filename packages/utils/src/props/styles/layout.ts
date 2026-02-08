import type { StyleProp } from "../types";

export const layoutPropKeys = ["ax", "ay", "direction"] as const;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content */
export const ax = {
  property: "justifyContent",
  values: [
    "space-around",
    "baseline",
    "space-between",
    "center",
    "end",
    "evenly",
    "normal",
    "start",
    "stretch",
  ] as const,
} satisfies StyleProp<"justifyContent">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-items */
export const ay = {
  property: "alignItems",
  values: ["baseline", "center", "end", "start", "stretch"] as const,
} satisfies StyleProp<"alignItems">;

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction */
export const direction = {
  property: "flexDirection",
  values: ["column", "row"],
} satisfies StyleProp<"flexDirection">;

export type LayoutProps = {
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content */
  ax?: (typeof ax.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/align-items */
  ay?: (typeof ay.values)[number];
  /** https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction */
  direction?: (typeof direction.values)[number];
};
