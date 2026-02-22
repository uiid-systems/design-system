"use client";

import { useState, useRef, type ReactNode } from "react";
import { cx } from "@uiid/utils";
import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";
import { Copy, Check } from "@uiid/icons";

import styles from "./code-block.module.css";

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

/**
 * MDX pre element wrapper.
 * When `pre` is replaced with this component, children is the code element from Shiki.
 * We wrap it in a styled container with copy functionality.
 */
export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const code = contentRef.current?.textContent || "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cx(styles["code-block"], styles["shiki-theme"])}>
      <Group className={styles["code-block-header"]} ax="end">
        <Button
          size="small"
          variant="ghost"
          shape="square"
          onClick={handleCopy}
          tooltip={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </Group>
      {/* Render as pre to maintain semantic structure */}
      <pre ref={contentRef} className={cx(styles["code-block-pre"], className)}>
        {children}
      </pre>
    </div>
  );
}
