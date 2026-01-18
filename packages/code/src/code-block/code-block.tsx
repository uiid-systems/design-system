"use client";

import { cx } from "@uiid/utils";

import { useHighlight } from "../highlighter/highlighter.hooks";

import type { CodeBlockProps } from "./code-block.types";
import { DEFAULT_LANGUAGE } from "./code-block.constants";
import styles from "./code-block.module.css";

import { CodeBlockHeader, CodeBlockContent } from "./subcomponents";

export const CodeBlock = ({
  code,
  language = DEFAULT_LANGUAGE,
  filename,
  showLineNumbers,
  copyable = true,
  highlightLines,
  html: prerenderedHtml,
  className,
  HeaderProps,
  CopyButtonProps,
  ...props
}: CodeBlockProps) => {
  const { html, loading, error } = useHighlight(code, language);
  const displayHtml = prerenderedHtml || html;

  const showHeader = filename || copyable;

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
        <div className={styles["code-block-loading"]}>Loading...</div>
      )}

      {error && !prerenderedHtml && (
        <div className={styles["code-block-error"]}>
          Error highlighting code: {error.message}
        </div>
      )}

      {displayHtml && (
        <CodeBlockContent
          html={displayHtml}
          showLineNumbers={showLineNumbers}
          highlightLines={highlightLines}
        />
      )}
    </div>
  );
};
CodeBlock.displayName = "CodeBlock";
