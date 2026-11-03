import { Prose, holdBackPartialWord, useStreamReveal } from "@uiid/typography";
import type { StreamRevealPass } from "@uiid/typography";
import { RuleType, compiler } from "markdown-to-jsx/react";
import type { MarkdownToJSX } from "markdown-to-jsx/react";
import { memo } from "react";

import type { MarkdownProps } from "./markdown.types";

const revealRule =
  (words: StreamRevealPass): MarkdownToJSX.Options["renderRule"] =>
  (next, node, _renderChildren, state) => {
    switch (node.type) {
      case RuleType.text:
        return words.text(node.text, state.key);
      case RuleType.codeInline:
        return words.unit(next(), node.text.length, state.key);
      case RuleType.codeBlock:
        words.skip(node.text.length);
        return next();
      default:
        return next();
    }
  };

/**
 * Memoized on its props: during a stream the transcript re-renders on every
 * token, and only the message whose text is changing should recompile.
 */
export const Markdown = memo(
  ({
    children,
    streaming = false,
    reveal = false,
    style,
    ...props
  }: MarkdownProps) => {
    const revealing = streaming && reveal;
    const words = useStreamReveal({ enabled: revealing });

    return (
      <Prose
        data-slot="markdown"
        style={revealing ? { ...words.style, ...style } : style}
        {...props}
      >
        {compiler(revealing ? holdBackPartialWord(children) : children, {
          wrapper: null,
          forceBlock: true,
          disableParsingRawHTML: true,
          optimizeForStreaming: streaming,
          ...(revealing && { renderRule: revealRule(words.pass()) }),
        })}
      </Prose>
    );
  },
);
Markdown.displayName = "Markdown";
