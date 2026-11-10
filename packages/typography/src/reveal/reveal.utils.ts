/**
 * Split before each word, so a whole whitespace run stays on the word before
 * it and spans wrap like words. Only leading whitespace gets a span of its own.
 */
export const splitWords = (text: string) =>
  text ? text.split(/(?<=\s)(?=\S)/) : [];

/** Length of text up to its last complete word, one the whitespace after it has reached. */
export const completeLength = (text: string) => {
  const tail = text.search(/\S+$/);
  return tail === -1 ? text.length : tail;
};

/**
 * A token that shows nothing worth a beat of its own, so it goes out with the word after it: one
 * with no letter or digit in it (a list marker, a quote's `>`, a dash), or an ordered-list number
 * like `1.` or `2)` with only indent and other markers before it on its line. The same number
 * mid-sentence is a word.
 */
const MARKER = String.raw`(?:[^\s\p{L}\p{N}]+|(?<=^[^\S\n]*(?:[^\s\p{L}\p{N}]+[^\S\n]+)*)\d{1,9}[.)])`;

/** A marker that is a whole token, at the position the regex starts from. */
const MARKER_TOKEN = new RegExp(String.raw`${MARKER}(?=\s|$)`, "muy");

/** A word, with any markers before it and the whitespace after it. */
const WORD = new RegExp(String.raw`\s*(?:${MARKER}\s+)*\S+\s*`, "muy");

/** The number of words between `from` and `limit`, not counting markers. */
export const countWords = (text: string, from = 0, limit = text.length) => {
  const token = /\S+/gu;
  const marker = new RegExp(MARKER_TOKEN);
  token.lastIndex = from;
  let count = 0;
  for (
    let match = token.exec(text);
    match && token.lastIndex <= limit;
    match = token.exec(text)
  ) {
    marker.lastIndex = match.index;
    if (!marker.test(text)) count++;
  }
  return count;
};

/** The position `count` words on from `from`, never past `limit`. */
export const advanceWords = (
  text: string,
  from: number,
  limit: number,
  count: number,
) => {
  const word = new RegExp(WORD);
  word.lastIndex = from;
  let end = from;
  for (
    let i = 0;
    i < count && word.exec(text) && word.lastIndex <= limit;
    i++
  ) {
    end = word.lastIndex;
  }
  return end;
};
