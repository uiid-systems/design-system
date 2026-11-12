import { compiler } from "markdown-to-jsx/react";
import type { MarkdownToJSX } from "markdown-to-jsx/react";

import type { MarkdownOverrides } from "./markdown.types";

type CompileOptions = {
  streaming: boolean;
  overrides?: MarkdownOverrides;
  renderRule?: MarkdownToJSX.Options["renderRule"];
};

/**
 * Compiles markdown to React nodes as a flat list of blocks, so `Prose` sees
 * each block as a direct child. Raw HTML is never parsed: it renders as text.
 * The sanitizer is markdown-to-jsx's default and is never replaced, so
 * `overrides` receive URLs it has already cleaned.
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
    ...(overrides && { overrides }),
    ...(renderRule && { renderRule }),
  });
