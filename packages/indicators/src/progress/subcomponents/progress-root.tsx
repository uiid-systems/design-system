"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { Stack } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import type { ProgressRootProps } from "../progress.types";
import { progressVariants } from "../progress.variants";

import styles from "../progress.module.css";

/*
 * `gap` and `w` are destructured into the `Stack` rather than written on it as a
 * literal: Base UI merges `render` props over the part's own, so a literal
 * there would silently beat a caller's `gap` or `w`.
 */
export const ProgressRoot = ({
  size,
  color,
  gap = 2,
  w = "full",
  children,
  className,
  ...props
}: ProgressRootProps) => {
  return (
    <BaseProgress.Root
      data-slot="progress"
      className={cx(
        styles["progress"],
        progressVariants({ size }),
        paletteClassName(color, styles["color"]),
        className,
      )}
      render={<Stack gap={gap} w={w} />}
      {...props}
    >
      {children}
    </BaseProgress.Root>
  );
};
ProgressRoot.displayName = "ProgressRoot";
