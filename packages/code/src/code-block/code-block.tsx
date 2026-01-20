"use client";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { useHighlight } from "../highlighter/highlighter.hooks";

import type { CodeBlockProps } from "./code-block.types";
import { DEFAULT_LANGUAGE } from "../code.constants";
import styles from "./code-block.module.css";

import { CodeBlockHeader, CodeBlockContent } from "./subcomponents";

export const CodeBlock = ({
  code,
  language = DEFAULT_LANGUAGE,
  filename,
  showLineNumbers,
  copyable = true,
  highlightLines,
  rows,
  html: prerenderedHtml,
  className,
  HeaderProps,
  CopyButtonProps,
  ...props
}: CodeBlockProps) => {
  const { html, loading, error } = useHighlight(code, language);
  const displayHtml = prerenderedHtml || html;

  const showHeader = filename || copyable;

  // Calculate max-height for rows constraint (same formula as CodeEditor)
  const contentStyle = rows
    ? {
        maxHeight: `calc(${rows} * var(--code-font-size) * var(--code-line-height) + 2 * var(--code-padding))`,
        overflowY: "auto" as const,
      }
    : undefined;

  return (
    <div
      data-slot="code-block"
      className={cx(styles["code-block"], className)}
      {...props}
    >
      {showHeader && (
        <CodeBlockHeader
          filename={filename}
          copyable={copyable}
          code={code}
          CopyButtonProps={CopyButtonProps}
          {...HeaderProps}
        />
      )}

      {loading && !prerenderedHtml && (
        <Stack
          ay="center"
          ax="center"
          className={styles["code-block-loading"]}
        />
      )}

      {error && !prerenderedHtml && (
        <Stack ay="center" ax="center" className={styles["code-block-error"]}>
          Error highlighting code: {error.message}
        </Stack>
      )}

      {displayHtml && (
        <CodeBlockContent
          html={displayHtml}
          showLineNumbers={showLineNumbers}
          highlightLines={highlightLines}
          style={contentStyle}
        />
      )}
    </div>
  );
};
CodeBlock.displayName = "CodeBlock";
