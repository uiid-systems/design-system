"use client";

import { CollapsibleRoot } from "@uiid/interactive";
import { cx } from "@uiid/utils";

import type { CodePreviewRootProps } from "../code-preview.types";

import blockStyles from "../../code-block/code-block.module.css";
import styles from "../code-preview.module.css";

/**
 * The frame: one border and radius around the canvas, the code and the
 * footer. It carries CodeBlock's own frame class, so its border, radius and
 * surface are CodeBlock's, and the footer toggle takes the look it has there.
 */
export const CodePreviewRoot = ({
  className,
  children,
  ...props
}: CodePreviewRootProps) => (
  <CollapsibleRoot
    data-slot="code-preview"
    className={cx(blockStyles["code-block"], styles["code-preview"], className)}
    {...props}
  >
    {children}
  </CollapsibleRoot>
);
CodePreviewRoot.displayName = "CodePreviewRoot";
