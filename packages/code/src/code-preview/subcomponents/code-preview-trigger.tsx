"use client";

import { Button } from "@uiid/buttons";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { CollapsibleTrigger } from "@uiid/interactive";
import { cx } from "@uiid/utils";

import type { CodePreviewTriggerProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

export const CodePreviewTrigger = ({
  showLabel = "Show code",
  hideLabel = "Hide code",
  className,
  ...props
}: CodePreviewTriggerProps) => (
  <CollapsibleTrigger
    data-slot="code-preview-trigger"
    {...props}
    // A function of the trigger's state, so the label follows the panel.
    render={(triggerProps, state) => (
      <Button
        {...(triggerProps as Omit<React.ComponentProps<"button">, "color">)}
        type="button"
        size="small"
        variant="ghost"
        className={cx(styles["code-preview-trigger"], className)}
      >
        <ChevronRightIcon
          aria-hidden
          className={styles["code-preview-trigger-icon"]}
        />
        {/* Both labels share one cell, and the hidden one keeps its width, so
            the trigger, and with it the frame, keeps its width on toggle. */}
        <span className={styles["code-preview-trigger-labels"]}>
          <span aria-hidden={state.open || undefined}>{showLabel}</span>
          <span aria-hidden={!state.open || undefined}>{hideLabel}</span>
        </span>
      </Button>
    )}
  />
);
CodePreviewTrigger.displayName = "CodePreviewTrigger";
