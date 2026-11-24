import { compiler, sanitizer } from "markdown-to-jsx/react";
import type { MarkdownToJSX } from "markdown-to-jsx/react";

import type { MarkdownOverrides } from "./markdown.types";

type CompileOptions = {
  streaming: boolean;
  overrides?: MarkdownOverrides;
  renderRule?: MarkdownToJSX.Options["renderRule"];
};

/** Control characters and spaces, which browsers strip from a URL before reading its scheme. */
// oxlint-disable-next-line no-control-regex
const URL_IGNORED = /[\u0000- ]/g;

/**
 * markdown-to-jsx's sanitizer, also run on the URL with whitespace removed:
 * the default checks the scheme as written, so `java\tscript:` slips past it
 * while a browser would still read it as `javascript:`.
 */
const strictSanitizer = (value: string): string | null =>
  sanitizer(value.replace(URL_IGNORED, "")) === null ? null : sanitizer(value);

/** Keeps only the `a` and `img` keys, so an object cast past the type cannot replace other elements. */
const pickOverrides = ({ a, img }: MarkdownOverrides) => ({
  ...(a && { a }),
  ...(img && { img }),
});

/**
 * Compiles markdown to React nodes as a flat list of blocks, so `Prose` sees
 * each block as a direct child. Raw HTML is never parsed: it renders as text.
 * Every URL goes through `strictSanitizer` before `overrides` receive it.
 */
export const compileMarkdown = (
  source: string,
  { streaming, overrides, renderRule }: CompileOptions,
): ReturnType<typeof compiler> =>
  compiler(source, {
    wrapper: null,
    forceBlock: true,
    disableParsingRawHTML: true,
    optimizeForStreaming: streaming,
    sanitizer: strictSanitizer,
    ...(overrides && { overrides: pickOverrides(overrides) }),
    ...(renderRule && { renderRule }),
  });

/** Length of text up to its last complete word, one the whitespace after it has reached. */
export const completeLength = (text: string) => {
  const tail = text.search(/\S+$/);
  return tail === -1 ? text.length : tail;
};

/** The characters that open a markdown block: list bullets, a quote's `>`, a heading's `#`. */
const MARK = String.raw`[-*+>#]`;

/**
 * A token that shows nothing worth a beat of its own, so it goes out with the word after it: a
 * run of block characters (`-`, `>`, `##`, `---`), or an ordered-list number like `1.` or `2)`
 * with only indent and other markers before it on its line. The same number mid-sentence is a
 * word, and so is any other token without a letter or digit, like an emoji, `—` or `}`.
 */
const MARKER = String.raw`(?:${MARK}+|(?<=^[^\S\n]*(?:${MARK}+[^\S\n]+)*)\d{1,9}[.)])`;

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
