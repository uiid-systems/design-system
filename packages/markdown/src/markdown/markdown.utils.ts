import { compiler, RuleType, sanitizer } from "markdown-to-jsx/react";
import type { MarkdownToJSX } from "markdown-to-jsx/react";
import { createElement } from "react";

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

/**
 * Keeps only the `a` and `img` keys, the element overrides markdown-to-jsx applies, so an object
 * cast past the type cannot replace other elements. `codeBlock` is a rule, not an element: it goes
 * through `withCodeBlock` instead.
 */
const pickOverrides = ({ a, img }: MarkdownOverrides) => ({
  ...(a && { a }),
  ...(img && { img }),
});

type RenderRule = MarkdownToJSX.Options["renderRule"];

/** A last line of only fence characters, after any indent or quote markers: maybe a closing fence still arriving. */
const PARTIAL_FENCE = /(?:^|\n)[ \t>]*(`+|~+)$/;

/**
 * The code of a block, less a last line that is `fence`. markdown-to-jsx reads the backticks of a
 * closing fence that has not fully arrived as code, so they would show as a line that vanishes a
 * chunk later, and the block would shrink. Held back, they show only if a later chunk turns out
 * to make them code.
 */
const withoutPartialFence = (text: string, fence: string) => {
  const body = text.replace(/\n$/, "");
  const lastLine = body.slice(body.lastIndexOf("\n") + 1);
  return lastLine.trim() === fence
    ? body.slice(0, body.length - lastLine.length)
    : text;
};

/**
 * Renders each code block with `CodeBlock`, then hands every node to `renderRule`, whose `next()`
 * for a code block returns that element. The element keeps the block's key and type as the text
 * grows, so an open fence streaming in updates one instance instead of remounting it. `fence`
 * is the run of fence characters the streaming source ends with, if any.
 */
const withCodeBlock =
  (
    CodeBlock: NonNullable<MarkdownOverrides["codeBlock"]>,
    fence: string | undefined,
    renderRule?: RenderRule,
  ): RenderRule =>
  (next, node, renderChildren, state) => {
    const render =
      node.type === RuleType.codeBlock
        ? () =>
            createElement(CodeBlock, {
              key: state.key,
              code: fence ? withoutPartialFence(node.text, fence) : node.text,
              language: node.lang,
            })
        : next;
    return renderRule
      ? renderRule(render, node, renderChildren, state)
      : render();
  };

/**
 * Compiles markdown to React nodes as a flat list of blocks, so `Prose` sees
 * each block as a direct child. Raw HTML is never parsed: it renders as text.
 * Every URL goes through `strictSanitizer` before `overrides` receive it.
 */
export const compileMarkdown = (
  source: string,
  { streaming, overrides, renderRule }: CompileOptions,
): ReturnType<typeof compiler> => {
  const fence = streaming ? source.match(PARTIAL_FENCE)?.[1] : undefined;
  const rule = overrides?.codeBlock
    ? withCodeBlock(overrides.codeBlock, fence, renderRule)
    : renderRule;
  return compiler(source, {
    wrapper: null,
    forceBlock: true,
    disableParsingRawHTML: true,
    optimizeForStreaming: streaming,
    sanitizer: strictSanitizer,
    ...(overrides && { overrides: pickOverrides(overrides) }),
    ...(rule && { renderRule: rule }),
  });
};

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
