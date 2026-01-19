"use client";

import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { DEFAULT_SHOW_LINE_NUMBERS } from "../../code.constants";
import { codeContentVariants } from "../../code.variants";
import type { CodeBlockContentProps } from "../code-block.types";
import styles from "../code-block.module.css";

export const CodeBlockContent = ({
  html,
  showLineNumbers = DEFAULT_SHOW_LINE_NUMBERS,
  className,
  ...props
}: CodeBlockContentProps) => {
  return (
    <Stack
      data-slot="code-block-content"
      data-line-numbers={showLineNumbers || undefined}
      className={cx(
        styles["code-block-content"],
        codeContentVariants({ showLineNumbers }),
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      ax="stretch"
      fullwidth
      {...props}
    />
  );
};
CodeBlockContent.displayName = "CodeBlockContent";
