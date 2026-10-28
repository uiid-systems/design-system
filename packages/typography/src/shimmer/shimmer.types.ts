import type { TextProps } from "../text/text.types";

export type ShimmerProps = Omit<TextProps, "children"> & {
  /** Text to shimmer — string only, since its length sizes the highlight */
  children: string;
  /** Duration of one sweep, in ms */
  duration?: number;
  /** Highlight width per character, in px */
  spread?: number;
};
