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
        {state.open ? hideLabel : showLabel}
      </Button>
    )}
  />
);
CodePreviewTrigger.displayName = "CodePreviewTrigger";
