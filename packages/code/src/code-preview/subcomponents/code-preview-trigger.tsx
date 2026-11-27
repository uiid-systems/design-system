"use client";

import { CollapsibleTrigger } from "@uiid/interactive";
import { cx } from "@uiid/utils";

import { CodeBlockExpandToggle } from "../../code-block";
import type { CodePreviewTriggerProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

/**
 * The footer that opens and closes the code. It is CodeBlock's expand toggle,
 * so inside `CodePreviewRoot` it takes the same full-width, centred, text-only
 * look as a CodeBlock's "Show more", and Collapsible gives it `aria-expanded`
 * and `aria-controls` for the panel.
 */
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
      <CodeBlockExpandToggle
        {...(triggerProps as Omit<React.ComponentProps<"button">, "color">)}
        className={cx(styles["code-preview-trigger"], className)}
        expanded={state.open}
        expandLabel={showLabel}
        collapseLabel={hideLabel}
      />
    )}
  />
);
CodePreviewTrigger.displayName = "CodePreviewTrigger";
