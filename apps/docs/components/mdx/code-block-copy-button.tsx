"use client";

import { useState, useCallback } from "react";
import { Button } from "@uiid/buttons";
import { Copy, Check } from "@uiid/icons";

export function CodeBlockCopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    const container = (e.currentTarget as HTMLElement).closest(
      '[data-slot="mdx-code-block"]'
    );
    const pre = container?.querySelector("pre");
    const code = pre?.textContent || "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <Button
      size="small"
      variant="ghost"
      shape="square"
      onClick={handleCopy}
      tooltip={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
