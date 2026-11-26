"use client";

import { Button } from "@uiid/buttons";
import { cx } from "@uiid/utils";
import type * as React from "react";

import type { CodeBlockExpandToggleProps } from "../code-block.types";

import styles from "../code-block.module.css";

export const CodeBlockExpandToggle = ({
  expanded = false,
  onExpandedChange,
  expandLabel = "Show more",
  collapseLabel = "Show less",
  onClick,
  className,
  ...props
}: CodeBlockExpandToggleProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    onExpandedChange?.(!expanded);
  };

  return (
    <Button
      type="button"
      data-slot="code-block-expand-toggle"
      aria-expanded={expanded}
      className={cx(styles["code-block-expand-toggle"], className)}
      size="small"
      variant="ghost"
      {...props}
      onClick={handleClick}
    >
      {expanded ? collapseLabel : expandLabel}
    </Button>
  );
};
CodeBlockExpandToggle.displayName = "CodeBlockExpandToggle";
