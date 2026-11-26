import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";
import * as React from "react";

import { DEFAULT_SHOW_LINE_NUMBERS, DEFAULT_WRAP } from "../../code.constants";
import { codeContentVariants } from "../../code.variants";
import type { CodeBlockContentProps } from "../code-block.types";

import styles from "../code-block.module.css";

export const CodeBlockContent = ({
  html,
  code,
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  wrap = DEFAULT_WRAP,
  className,
  ...props
}: CodeBlockContentProps) => {
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
  };

  // Highlighted (shiki) path — preferred when html is available.
  if (html) {
    return (
      <Stack
        {...sharedAttrs}
        className={sharedClass}
        dangerouslySetInnerHTML={{ __html: html }}
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
