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
