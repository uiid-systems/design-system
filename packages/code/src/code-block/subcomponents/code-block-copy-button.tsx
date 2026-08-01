"use client";

import { Button } from "@uiid/buttons";
import { CopyIcon, CheckIcon } from "@uiid/icons";
import { cx } from "@uiid/utils";
import * as React from "react";

import { DEFAULT_CODE } from "../../code.constants";
import type { CodeBlockCopyButtonProps } from "../code-block.types";

import styles from "../code-block.module.css";

export const CodeBlockCopyButton = ({
  code = DEFAULT_CODE,
  onCopy,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [code, onCopy]);

  return (
    <Button
      type="button"
      data-slot="code-block-copy-button"
      data-copied={copied}
      aria-label={copied ? "Copied" : "Copy code"}
      tooltip={copied ? "Copied" : "Copy"}
      className={cx(styles["code-block-icon-button"], className)}
      onClick={handleCopy}
      size="xsmall"
      variant="ghost"
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
};
CodeBlockCopyButton.displayName = "CodeBlockCopyButton";
