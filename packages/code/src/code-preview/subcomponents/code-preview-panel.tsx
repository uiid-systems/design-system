"use client";

import { CollapsiblePanel } from "@uiid/interactive";
import { cx } from "@uiid/utils";

import type { CodePreviewPanelProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

/**
 * Mounted from the first render and kept while closed, so the code sets the
 * frame's width either way. Inside `CodePreviewRoot` a closed panel keeps its
 * width at no height, hidden from sight, the tab order and assistive tech.
 */
export const CodePreviewPanel = ({
  instant = false,
  keepMounted = true,
  className,
  children,
  ...props
}: CodePreviewPanelProps) => (
  <CollapsiblePanel
    data-slot="code-preview-panel"
    className={cx(styles["code-preview-panel"], className)}
    ax="stretch"
    instant={instant}
    keepMounted={keepMounted}
    {...props}
  >
    {children}
  </CollapsiblePanel>
);
CodePreviewPanel.displayName = "CodePreviewPanel";
