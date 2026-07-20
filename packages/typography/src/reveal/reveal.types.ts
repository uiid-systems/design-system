import type { TextProps } from "../text/text.types";

export type RevealProps = Omit<TextProps, "children"> & {
  /** Text to reveal — split into words, so string content only */
  children: string;
  /** Delay between each word's animation start, in ms */
  stagger?: number;
  /** Duration of each word's fade/blur-in, in ms */
  duration?: number;
  /** Blur radius each word starts from, in px */
  blur?: number;
};
