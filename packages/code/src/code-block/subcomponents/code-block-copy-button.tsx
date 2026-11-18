"use client";

import { Button } from "@uiid/buttons";
import { CheckIcon } from "@uiid/icons/check";
import { CopyIcon } from "@uiid/icons/copy";
import { cx } from "@uiid/utils";
import * as React from "react";

import { DEFAULT_CODE } from "../../code.constants";
import type { CodeBlockCopyButtonProps } from "../code-block.types";

import styles from "../code-block.module.css";

export const CodeBlockCopyButton = ({
  code = DEFAULT_CODE,
  onCopy,
  onClick,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);
  const resetRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  // Drop a pending reset on unmount, so it never sets state afterwards.
  React.useEffect(() => () => clearTimeout(resetRef.current), []);

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        onCopy?.(code);
        // Each copy restarts the "Copied" window rather than stacking timers.
        clearTimeout(resetRef.current);
        resetRef.current = setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    },
    [code, onCopy, onClick],
  );

  return (
    <Button
      type="button"
      data-slot="code-block-copy-button"
      data-copied={copied}
      aria-label={copied ? "Copied" : "Copy code"}
      tooltip={copied ? "Copied" : "Copy"}
      className={cx(styles["code-block-icon-button"], className)}
      onClick={handleClick}
      size="xsmall"
      variant="ghost"
      {...props}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
};
CodeBlockCopyButton.displayName = "CodeBlockCopyButton";
