import type { StyleProp } from "../types";

export const layoutPropKeys = ["ax", "ay", "direction"] as const;

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

export const ay = {
  property: "alignItems",
  values: ["baseline", "center", "end", "start", "stretch"] as const,
} satisfies StyleProp<"alignItems">;

export const direction = {
  property: "flexDirection",
  values: ["column", "row"],
} satisfies StyleProp<"flexDirection">;

export type LayoutProps = {
  ax?: (typeof ax.values)[number];
  ay?: (typeof ay.values)[number];
  direction?: (typeof direction.values)[number];
};
