"use client";

import * as React from "react";

import { Button } from "@uiid/buttons";
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
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [code]);

  return (
    <Button
      type="button"
      data-slot="code-block-copy-button"
      data-copied={copied}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cx(styles["code-block-copy-button"], className)}
      onClick={handleCopy}
      size="xsmall"
      variant="inverted"
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {children ?? (copied ? "Copied" : "Copy")}
    </Button>
  );
};
CodeBlockCopyButton.displayName = "CodeBlockCopyButton";
