import type { TextProps } from "../text/text.types";

/**
 * No `balance`, `nowrap` or `truncate`: Reveal wraps with `text-wrap: wrap`, because `pretty` and
 * `balance` re-break lines as words arrive and move words already shown. That inline wrap mode
 * also overrides the two props that turn wrapping off.
 */
export type RevealProps = Omit<
  TextProps,
  "children" | "balance" | "nowrap" | "truncate"
> & {
  /** Text to reveal — split into words, so string content only */
  children: string;
  /** Delay between each word's animation start, in ms */
  stagger?: number;
  /** Duration of each word's fade/blur-in, in ms */
  duration?: number;
  /** Blur radius each word starts from, in px */
  blur?: number;
};
