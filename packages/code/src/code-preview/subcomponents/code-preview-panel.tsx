"use client";

import { CollapsiblePanel } from "@uiid/interactive";
import { cx } from "@uiid/utils";

import type { CodePreviewPanelProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

export const CodePreviewPanel = ({
  instant = false,
  className,
  children,
  ...props
}: CodePreviewPanelProps) => (
  <CollapsiblePanel
    data-slot="code-preview-panel"
    className={cx(styles["code-preview-panel"], className)}
    ax="stretch"
    instant={instant}
    {...props}
  >
    {children}
  </CollapsiblePanel>
);
CodePreviewPanel.displayName = "CodePreviewPanel";
