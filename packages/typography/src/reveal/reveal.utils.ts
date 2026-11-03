/** Split keeping trailing whitespace attached so spans wrap like words. */
export const splitWords = (text: string) => (text ? text.split(/(?<=\s)/) : []);

/**
 * Drop the unfinished word at the end of text that is still arriving, so every
 * word reveals whole. A word cut across two chunks would otherwise fade in as
 * its first piece, and the rest would appear without animating.
 */
export const holdBackPartialWord = (text: string) => {
  const tail = text.search(/\S+$/);
  return tail === -1 ? text : text.slice(0, tail);
};
