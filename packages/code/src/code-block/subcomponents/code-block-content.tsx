"use client";

import { Stack } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";
import * as React from "react";

import { DEFAULT_SHOW_LINE_NUMBERS, DEFAULT_WRAP } from "../../code.constants";
import { codeContentVariants } from "../../code.variants";
import { useScrollOverflow } from "../code-block.hooks";
import type { CodeBlockContentProps } from "../code-block.types";

import styles from "../code-block.module.css";

/** Shiki's `tabindex="0"` on its <pre>, set whether or not the code scrolls. */
const PRE_TABINDEX = /^(<pre\b[^>]*?)\s+tabindex="0"/;

export const CodeBlockContent = ({
  html,
  code,
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  wrap = DEFAULT_WRAP,
  className,
  ref,
  "aria-label": label = "Code",
  ...props
}: CodeBlockContentProps) => {
  // The content is the box that scrolls, so it is the tab stop the keyboard
  // scrolls with, and only while it has code to scroll to. While it is, it is
  // a region named by `aria-label`, so a screen reader announces where focus
  // landed; otherwise it is a plain box, which a name would not suit.
  const scroll = useScrollOverflow();
  const composedRef = useComposedRefs(ref, scroll.ref);

  // Shiki's own tab stop on the <pre> is removed from the markup itself, so
  // the server and the client render the same string. One object per string:
  // React writes `innerHTML` again whenever the object changes, which would
  // replace the code, and any selection in it, on every render.
  const innerHtml = React.useMemo(
    () => html && { __html: html.replace(PRE_TABINDEX, "$1") },
    [html],
  );

  const sharedClass = cx(
    styles["code-block-content"],
    wrap && styles["code-block-content-wrap"],
    codeContentVariants({ showLineNumbers }),
    className,
  );
  const sharedAttrs = {
    "data-slot": "code-block-content",
    "data-line-numbers": showLineNumbers || undefined,
    "data-wrap": wrap || undefined,
    ax: "stretch" as const,
    w: "full" as const,
    ref: composedRef,
    ...(scroll.scrolls && {
      tabIndex: 0,
      role: "region",
      "aria-label": label,
    }),
  };

  // Highlighted (shiki) path — preferred when html is available.
  if (innerHtml) {
    return (
      <Stack
        {...sharedAttrs}
        className={sharedClass}
        dangerouslySetInnerHTML={innerHtml}
        {...props}
      />
    );
  }

  // Unhighlighted fallback — same layout, no syntax colors. Used until the
  // highlighter finishes its async work so users don't see a flash of empty
  // space (or a "Loading..." string). It mirrors Shiki's markup: a newline
  // between the line spans is what breaks the rows inside the <pre>, and a
  // blank line is an empty span, so nothing moves when the colors land.
  const lines = (code ?? "").split("\n");
  return (
    <Stack {...sharedAttrs} className={sharedClass} {...props}>
      <pre>
        <code>
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && "\n"}
              <span className="line">{line}</span>
            </React.Fragment>
          ))}
        </code>
      </pre>
    </Stack>
  );
};
CodeBlockContent.displayName = "CodeBlockContent";
