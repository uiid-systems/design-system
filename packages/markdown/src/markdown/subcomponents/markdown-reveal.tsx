"use client";

import { Prose, useStreamPace, useStreamReveal } from "@uiid/typography";
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
  const paced = useStreamPace(children, streaming);
  const words = useStreamReveal({
    streaming: paced.streaming,
    streamId: paced.streamId,
  });

  return (
    <Prose data-slot="markdown" style={{ ...words.style, ...style }} {...props}>
      {compileMarkdown(
        paced.text,
        paced.streaming,
        // The pass would hand the text back as it is; skipping the rule saves the per-node calls.
        words.active ? revealRule(words.pass()) : undefined,
      )}
    </Prose>
  );
};
