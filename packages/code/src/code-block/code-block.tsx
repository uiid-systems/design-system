"use client";

import * as React from "react";
import { createPortal } from "react-dom";

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
  onFullscreenChange,
  onCopy,
  html: prerenderedHtml,
  className,
  HeaderProps,
  LanguageIconProps,
  WrapButtonProps,
  CopyButtonProps,
  FullscreenButtonProps,
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

  const [fullscreen, setFullscreen] = React.useState(false);
  const handleFullscreenChange = React.useCallback(
    (next: boolean) => {
      setFullscreen(next);
      onFullscreenChange?.(next);
    },
    [onFullscreenChange],
  );

  // While fullscreen: close on Escape and lock body scroll behind the overlay.
  React.useEffect(() => {
    if (!fullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleFullscreenChange(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen, handleFullscreenChange]);

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

  const isCollapsed = rows != null && !expanded && !fullscreen;
  // In fullscreen the scroll area flex-fills the overlay (see CSS); skip the
  // collapsed max-height so the inline style doesn't fight the layout.
  const wrapperStyle =
    !fullscreen && collapsedMaxHeight
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

  const showToggle = rows != null && (overflows || expanded) && !fullscreen;

  const block = (
    <div
      data-slot="code-block"
      data-expanded={rows != null ? expanded || undefined : undefined}
      data-wrap={wrap || undefined}
      data-fullscreen={fullscreen || undefined}
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
        fullscreenable
        fullscreen={fullscreen}
        onFullscreenChange={handleFullscreenChange}
        LanguageIconProps={LanguageIconProps}
        WrapButtonProps={WrapButtonProps}
        CopyButtonProps={{ onCopy, ...CopyButtonProps }}
        FullscreenButtonProps={FullscreenButtonProps}
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

  if (!fullscreen) return block;

  // Portal to the body so the overlay escapes any ancestor stacking/overflow
  // context. `fullscreen` is always false on the server, so SSR renders `block`.
  return createPortal(
    <div
      data-slot="code-block-fullscreen"
      className={styles["code-block-fullscreen"]}
    >
      <div
        data-slot="code-block-backdrop"
        className={styles["code-block-backdrop"]}
        onClick={() => handleFullscreenChange(false)}
      />
      {block}
    </div>,
    document.body,
  );
};
CodeBlock.displayName = "CodeBlock";
