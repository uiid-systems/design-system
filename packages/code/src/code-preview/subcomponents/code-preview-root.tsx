"use client";

import { CollapsibleRoot } from "@uiid/interactive";
import { cx } from "@uiid/utils";

import type { CodePreviewRootProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

/** The frame: one border and radius around the canvas, the bar and the code. */
export const CodePreviewRoot = ({
  className,
  children,
  ...props
}: CodePreviewRootProps) => (
  <CollapsibleRoot
    data-slot="code-preview"
    className={cx(styles["code-preview"], className)}
    {...props}
  >
    {children}
  </CollapsibleRoot>
);
CodePreviewRoot.displayName = "CodePreviewRoot";
