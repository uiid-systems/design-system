"use client";

import * as React from "react";

import { cx } from "@uiid/utils";

import { useHighlight } from "../highlighter/highlighter.hooks";

import type { CodeBlockProps } from "./code-block.types";
import { DEFAULT_LANGUAGE, DEFAULT_WRAP } from "../code.constants";
import styles from "./code-block.module.css";

import { CodeBlockHeader, CodeBlockContent } from "./subcomponents";

export const CodeBlock = ({
  code,
  language: languageProp,
  filename,
  showLineNumbers,
  highlightLines,
  rows,
  defaultExpanded = false,
  defaultWrap = DEFAULT_WRAP,
  onWrapChange,
  onCopy,
  html: prerenderedHtml,
  className,
  HeaderProps,
  LanguageIconProps,
  WrapButtonProps,
  CopyButtonProps,
  ...props
}: CodeBlockProps) => {
  const language = languageProp ?? DEFAULT_LANGUAGE;

  const [wrap, setWrap] = React.useState(defaultWrap);
  const handleWrapChange = React.useCallback(
    (next: boolean) => {
      setWrap(next);
      onWrapChange?.(next);
    },
    [onWrapChange],
  );

  const { html, error } = useHighlight(code, language, {
    highlightLines,
  });
  const displayHtml = prerenderedHtml || html || undefined;

  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [overflows, setOverflows] = React.useState(false);
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);

  const collapsedMaxHeight = rows
    ? `calc(${rows} * var(--code-font-size) * var(--code-line-height) + 2 * var(--code-padding))`
    : undefined;

  const isCollapsed = rows != null && !expanded;
  const wrapperStyle = collapsedMaxHeight
    ? {
        maxHeight: isCollapsed ? collapsedMaxHeight : undefined,
        overflowY: "auto" as const,
      }
    : undefined;

  React.useEffect(() => {
    if (!rows || !contentWrapperRef.current || !displayHtml) {
      return;
    }
    const el = contentWrapperRef.current;
    setOverflows(el.scrollHeight > el.clientHeight + 1);
  }, [displayHtml, rows, wrap, expanded]);

  const showToggle = rows != null && (overflows || expanded);

  return (
    <div
      data-slot="code-block"
      data-expanded={rows != null ? expanded || undefined : undefined}
      data-wrap={wrap || undefined}
      className={cx(styles["code-block"], className)}
      {...props}
    >
      <CodeBlockHeader
        filename={filename}
        language={languageProp}
        copyable
        code={code}
        wrappable
        wrap={wrap}
        onWrapChange={handleWrapChange}
        LanguageIconProps={LanguageIconProps}
        WrapButtonProps={WrapButtonProps}
        CopyButtonProps={{ onCopy, ...CopyButtonProps }}
        {...HeaderProps}
      />

      <div
        ref={contentWrapperRef}
        data-slot="code-block-scroll"
        className={styles["code-block-scroll"]}
        style={wrapperStyle}
      >
        <CodeBlockContent
          html={displayHtml}
          code={code}
          showLineNumbers={showLineNumbers}
          wrap={wrap}
        />
      </div>

      {error && !prerenderedHtml && (
        <div
          data-slot="code-block-error"
          className={styles["code-block-error"]}
        >
          [Error: {error.message}]
        </div>
      )}

      {showToggle && (
        <button
          type="button"
          data-slot="code-block-expand-toggle"
          className={styles["code-block-expand-toggle"]}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
CodeBlock.displayName = "CodeBlock";
