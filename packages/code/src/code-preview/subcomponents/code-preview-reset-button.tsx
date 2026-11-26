"use client";

import { Button } from "@uiid/buttons";
import { RotateCcwIcon } from "@uiid/icons/rotate-ccw";
import { cx } from "@uiid/utils";

import type { CodePreviewResetButtonProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

export const CodePreviewResetButton = ({
  className,
  ...props
}: CodePreviewResetButtonProps) => (
  <Button
    type="button"
    data-slot="code-preview-reset-button"
    aria-label="Reset preview"
    tooltip="Reset preview"
    className={cx(styles["code-preview-reset-button"], className)}
    size="small"
    variant="ghost"
    shape="square"
    {...props}
  >
    <RotateCcwIcon aria-hidden />
  </Button>
);
CodePreviewResetButton.displayName = "CodePreviewResetButton";
