/**
 * Split before each word, so a whole whitespace run stays on the word before it and spans wrap
 * like words. Only leading whitespace gets a piece of its own.
 */
export const splitWords = (text: string) =>
  text ? text.split(/(?<=\s)(?=\S)/) : [];

/** Length of text up to its last complete word, one the whitespace after it has reached. */
export const completeLength = (text: string) => {
  const tail = text.search(/\S+$/);
  return tail === -1 ? text.length : tail;
};

/**
 * A word, with any tokens before it that have no letter or digit in them (a list marker, a
 * quote's `>`, a dash) and the whitespace after it. Those tokens show nothing worth a beat of
 * their own, so they go out with the word that follows.
 */
const WORD = /\s*(?:[^\s\p{L}\p{N}]+\s+)*\S+\s*/uy;

export const countWords = (text: string) =>
  text.match(/\S*[\p{L}\p{N}]\S*/gu)?.length ?? 0;

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
