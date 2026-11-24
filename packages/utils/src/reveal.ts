/**
 * Word-reveal plumbing shared by Reveal in @uiid/typography and Markdown's
 * `reveal` in @uiid/markdown. Both animate words with the
 * `[data-animate="reveal"]` rule in @uiid/tokens.
 */

/** Duration of each word's fade/blur-in, in ms. */
export const REVEAL_DEFAULT_DURATION = 400;

/** Blur radius each word starts from, in px. */
export const REVEAL_DEFAULT_BLUR = 6;

/**
 * Split before each word, so a whole whitespace run stays on the word before
 * it and spans wrap like words. Only leading whitespace gets a span of its own.
 */
export const splitWords = (text: string) =>
  text ? text.split(/(?<=\s)(?=\S)/) : [];
