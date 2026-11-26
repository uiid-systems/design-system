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
      className={cx(styles["code-block-expand-toggle"], className)}
      size="small"
      variant="ghost"
      {...props}
      // After the spread, so an untyped `aria-expanded` cannot contradict `expanded`.
      aria-expanded={expanded}
      onClick={handleClick}
    >
      {expanded ? collapseLabel : expandLabel}
    </Button>
  );
};
CodeBlockExpandToggle.displayName = "CodeBlockExpandToggle";
