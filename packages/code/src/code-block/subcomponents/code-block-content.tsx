import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

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
    fullwidth: true,
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
  // space (or a "Loading..." string).
  const lines = (code ?? "").split("\n");
  return (
    <Stack {...sharedAttrs} className={sharedClass} {...props}>
      <pre>
        <code>
          {lines.map((line, i) => (
            <span key={i} className="line">
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </Stack>
  );
};
CodeBlockContent.displayName = "CodeBlockContent";
