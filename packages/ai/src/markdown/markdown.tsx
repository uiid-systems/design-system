import { Prose } from "@uiid/typography";
import { compiler } from "markdown-to-jsx/react";

import type { MarkdownProps } from "./markdown.types";

export const Markdown = ({
  children,
  streaming = false,
  ...props
}: MarkdownProps) => (
  <Prose data-slot="markdown" {...props}>
    {compiler(children, {
      wrapper: null,
      forceBlock: true,
      optimizeForStreaming: streaming,
    })}
  </Prose>
);
Markdown.displayName = "Markdown";
