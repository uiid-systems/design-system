import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CodePreviewCanvasProps } from "../code-preview.types";

import styles from "../code-preview.module.css";

/**
 * The example's zone. It centres the example on both axes with `safe center`,
 * written in its CSS module because the layout props have no safe keyword: an
 * example wider than the canvas then starts at its start edge and scrolls,
 * rather than overflowing both sides. `ax` and `ay` still override it.
 */
export const CodePreviewCanvas = ({
  className,
  children,
  ...props
}: CodePreviewCanvasProps) => (
  <Stack
    data-slot="code-preview-canvas"
    className={cx(styles["code-preview-canvas"], className)}
    p={6}
    w="full"
    {...props}
  >
    {children}
  </Stack>
);
CodePreviewCanvas.displayName = "CodePreviewCanvas";
