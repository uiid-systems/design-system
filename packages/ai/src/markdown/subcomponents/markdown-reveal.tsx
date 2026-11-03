"use client";

import { Prose, holdBackPartialWord, useStreamReveal } from "@uiid/typography";
import type { StreamRevealPass } from "@uiid/typography";
import { RuleType } from "markdown-to-jsx/react";
import type { MarkdownToJSX } from "markdown-to-jsx/react";

import type { MarkdownProps } from "../markdown.types";
import { compileMarkdown } from "../markdown.utils";

type MarkdownRevealProps = Omit<MarkdownProps, "reveal" | "streaming"> & {
  streaming: boolean;
};

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

/** The `reveal` path of `Markdown`, kept apart so plain `Markdown` has no hooks. */
export const MarkdownReveal = ({
  children,
  streaming,
  style,
  ...props
}: MarkdownRevealProps) => {
  const words = useStreamReveal({ streaming });

  return (
    <Prose
      data-slot="markdown"
      style={words.active ? { ...words.style, ...style } : style}
      {...props}
    >
      {compileMarkdown(
        streaming ? holdBackPartialWord(children) : children,
        streaming,
        words.active ? revealRule(words.pass()) : undefined,
      )}
    </Prose>
  );
};
