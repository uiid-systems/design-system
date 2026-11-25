"use client";

import { cx } from "@uiid/utils";

import { useHighlight } from "../highlighter/highlighter.hooks";
import type { CodeInlineProps } from "./code-inline.types";
import { extractCodeContent } from "./code-inline.utils";

import styles from "./code-inline.module.css";

export const CodeInline = ({
  language,
  html: prerenderedHtml,
  className,
  children,
  ...props
}: CodeInlineProps) => {
  // Only a plain string can be highlighted; anything else renders as given.
  const code = typeof children === "string" ? children : null;
  const { html } = useHighlight(code ?? "", language, {
    enabled: !!language && code !== null && !prerenderedHtml,
  });

  // The inner markup of Shiki's output, or null to render the children: no
  // language, highlighting still pending, or markup without a code element.
  const markup = language ? extractCodeContent(prerenderedHtml || html) : null;

  return (
    <code
      data-slot="code-inline"
      className={cx(styles["code-inline"], className)}
      {...props}
      {...(markup === null
        ? { children }
        : { dangerouslySetInnerHTML: { __html: markup } })}
    />
  );
};
CodeInline.displayName = "CodeInline";
