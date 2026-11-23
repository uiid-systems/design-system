/**
 * Split before each word, so a whole whitespace run stays on the word before
 * it and spans wrap like words. Only leading whitespace gets a span of its own.
 */
export const splitWords = (text: string) =>
  text ? text.split(/(?<=\s)(?=\S)/) : [];
