import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CodePreviewCanvasProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

export const CodePreviewCanvas = ({
  className,
  children,
  ...props
}: CodePreviewCanvasProps) => (
  <Stack
    data-slot="code-preview-canvas"
    className={cx(styles["code-preview-canvas"], className)}
    ax="center"
    ay="center"
    p={6}
    w="full"
    {...props}
  >
    {children}
  </Stack>
);
CodePreviewCanvas.displayName = "CodePreviewCanvas";
