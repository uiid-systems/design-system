"use client";

import { useMemo } from "react";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { DEFAULT_SHOW_LINE_NUMBERS } from "../../code.constants";
import { codeContentVariants } from "../../code.variants";
import type { CodeBlockContentProps } from "../code-block.types";
import styles from "../code-block.module.css";

/**
 * Adds data-highlighted attribute to specific lines in Shiki HTML output.
 * Lines are 1-indexed to match editor conventions.
 */
function addLineHighlights(html: string, lines: number[]): string {
  if (!lines.length) return html;

  const lineSet = new Set(lines);
  let lineNumber = 0;

  return html.replace(/<span class="line">/g, (match) => {
    lineNumber++;
    if (lineSet.has(lineNumber)) {
      return '<span class="line" data-highlighted>';
    }
    return match;
  });
}

export const CodeBlockContent = ({
  html,
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  highlightLines,
  className,
  ...props
}: CodeBlockContentProps) => {
  const processedHtml = useMemo(() => {
    if (!highlightLines?.length) return html;
    return addLineHighlights(html, highlightLines);
  }, [html, highlightLines]);

  return (
    <Stack
      data-slot="code-block-content"
      data-line-numbers={showLineNumbers || undefined}
      className={cx(
        styles["code-block-content"],
        codeContentVariants({ showLineNumbers }),
        className
      )}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
      ax="stretch"
      fullwidth
      {...props}
    />
  );
};
CodeBlockContent.displayName = "CodeBlockContent";
