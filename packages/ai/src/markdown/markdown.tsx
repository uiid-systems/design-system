import { Prose } from "@uiid/typography";
import { compiler } from "markdown-to-jsx/react";
import { memo } from "react";

import type { MarkdownProps } from "./markdown.types";

/**
 * Memoized on its props: during a stream the transcript re-renders on every
 * token, and only the message whose text is changing should recompile.
 */
export const Markdown = memo(
  ({ children, streaming = false, ...props }: MarkdownProps) => (
    <Prose data-slot="markdown" {...props}>
      {compiler(children, {
        wrapper: null,
        forceBlock: true,
        disableParsingRawHTML: true,
        optimizeForStreaming: streaming,
      })}
    </Prose>
  ),
);
Markdown.displayName = "Markdown";
