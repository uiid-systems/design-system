import { compiler } from "markdown-to-jsx/react";
import type { MarkdownToJSX } from "markdown-to-jsx/react";

export const compileMarkdown = (
  source: string,
  streaming: boolean,
  renderRule?: MarkdownToJSX.Options["renderRule"],
): ReturnType<typeof compiler> =>
  compiler(source, {
    wrapper: null,
    forceBlock: true,
    disableParsingRawHTML: true,
    optimizeForStreaming: streaming,
    ...(renderRule && { renderRule }),
  });
