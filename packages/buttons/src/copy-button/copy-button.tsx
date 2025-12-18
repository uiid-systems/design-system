"use client";

import { useState } from "react";

import { Check, Copy } from "@uiid/icons";
import { cx } from "@uiid/utils";

import { Button } from "../button/button";

import type { CopyButtonProps } from "./copy-button.types";
import styles from "./copy-button.module.css";

export const CopyButton = ({
  clipboardText,
  copyText = "Copy",
  copiedText = "Copied!",
  onClick,
  className,
  ...props
}: CopyButtonProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    try {
      await navigator.clipboard.writeText(clipboardText);
      setCopied(true);
      onClick?.(e as React.MouseEvent<HTMLButtonElement>);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      {...props}
      className={cx(styles["copy-button"], className)}
      onClick={handleCopy}
      disabled={copied}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? copiedText : copyText}
    </Button>
  );
};
CopyButton.displayName = "CopyButton";
