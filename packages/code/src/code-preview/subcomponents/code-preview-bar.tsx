import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CodePreviewBarProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

/**
 * @deprecated CodePreview no longer renders a bar: `CodePreviewTrigger` is the
 * footer and the copy button floats over the code in `CodePreviewPanel`.
 */
export const CodePreviewBar = ({
  className,
  children,
  ...props
}: CodePreviewBarProps) => (
  <Group
    data-slot="code-preview-bar"
    className={cx(styles["code-preview-bar"], className)}
    ax="space-between"
    ay="center"
    gap={2}
    px={2}
    py={1}
    bt={1}
    w="full"
    {...props}
  >
    {children}
  </Group>
);
CodePreviewBar.displayName = "CodePreviewBar";
