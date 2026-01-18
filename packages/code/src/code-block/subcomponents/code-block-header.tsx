"use client";

import { cx } from "@uiid/utils";

import { DEFAULT_COPYABLE, DEFAULT_CODE } from "../code-block.constants";
import type { CodeBlockHeaderProps } from "../code-block.types";
import styles from "../code-block.module.css";

import { CodeBlockCopyButton } from "./code-block-copy-button";

export const CodeBlockHeader = ({
  filename,
  copyable = DEFAULT_COPYABLE,
  code = DEFAULT_CODE,
  className,
  CopyButtonProps,
  children,
  ...props
}: CodeBlockHeaderProps) => {
  return (
    <div
      data-slot="code-block-header"
      className={cx(styles["code-block-header"], className)}
      {...props}
    >
      <span className={styles["code-block-filename"]}>{filename}</span>
      {children}
      {copyable && code && (
        <CodeBlockCopyButton code={code} {...CopyButtonProps} />
      )}
    </div>
  );
};
CodeBlockHeader.displayName = "CodeBlockHeader";
