"use client";

import { cx } from "@uiid/utils";

import type { CodeInlineProps } from "./code-inline.types";
import { useHighlight } from "../highlighter/highlighter.hooks";
import styles from "./code-inline.module.css";

export const CodeInline = ({
  language,
  html: prerenderedHtml,
  className,
  children,
  ...props
}: CodeInlineProps) => {
  // Only use highlighting if language is provided
  const code = typeof children === "string" ? children : "";
  const { html } = useHighlight(code, language || "typescript");

  // If no language provided, render as plain code
  if (!language) {
    return (
      <code
        data-slot="code-inline"
        className={cx(styles["code-inline"], className)}
        {...props}
      >
        {children}
      </code>
    );
  }

  // Use prerendered HTML or highlighted HTML
  const displayHtml = prerenderedHtml || html;

  if (displayHtml) {
    // Extract just the code content from Shiki output
    // Shiki wraps in pre > code, we want just the inner content
    const codeContent = displayHtml
      .replace(/<pre[^>]*><code[^>]*>/, "")
      .replace(/<\/code><\/pre>/, "");

    return (
      <code
        data-slot="code-inline"
        className={cx(styles["code-inline"], className)}
        dangerouslySetInnerHTML={{ __html: codeContent }}
        {...props}
      />
    );
  }

  // Fallback while loading
  return (
    <code
      data-slot="code-inline"
      className={cx(styles["code-inline"], className)}
      {...props}
    >
      {children}
    </code>
  );
};
CodeInline.displayName = "CodeInline";
