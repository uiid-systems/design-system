"use client";

import { Button } from "@uiid/buttons";
import { RotateCcwIcon } from "@uiid/icons/rotate-ccw";
import { cx } from "@uiid/utils";

import type { CodePreviewResetButtonProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

export const CodePreviewResetButton = ({
  tooltip = "Reset preview",
  shape = "square",
  className,
  ...props
}: CodePreviewResetButtonProps) => {
  // A string tooltip on a square or circle Button is also its name, so the
  // visible text and the name agree. Otherwise the button would have none, so
  // it is named "Reset preview". A caller's `aria-label` wins either way.
  const namedByTooltip =
    typeof tooltip === "string" && (shape === "square" || shape === "circle");

  return (
    <Button
      type="button"
      data-slot="code-preview-reset-button"
      aria-label={namedByTooltip ? undefined : "Reset preview"}
      tooltip={tooltip}
      className={cx(styles["code-preview-reset-button"], className)}
      size="small"
      variant="subtle"
      shape={shape}
      {...props}
    >
      <RotateCcwIcon aria-hidden />
    </Button>
  );
};
CodePreviewResetButton.displayName = "CodePreviewResetButton";
