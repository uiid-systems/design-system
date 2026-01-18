"use client";

import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { CodeBlockCopyButtonProps } from "../code-block.types";
import styles from "../code-block.module.css";

export const CodeBlockCopyButton = ({
  code,
  className,
  children,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [code]);

  return (
    <button
      type="button"
      data-slot="code-block-copy-button"
      data-copied={copied}
      className={cx(styles["code-block-copy-button"], className)}
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {children ?? (copied ? "Copied" : "Copy")}
    </button>
  );
};
CodeBlockCopyButton.displayName = "CodeBlockCopyButton";
