"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { Stack } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { ProgressRootProps } from "../progress.types";
import { progressVariants } from "../progress.variants";

import styles from "../progress.module.css";

/*
 * `gap` is destructured into the `Stack` rather than written on it as a
 * literal: Base UI merges `render` props over the part's own, so a literal
 * there would silently beat a caller's `gap`.
 */
export const ProgressRoot = ({
  size,
  color,
  gap = 2,
  fullwidth = true,
  children,
  className,
  ...props
}: ProgressRootProps) => {
  return (
    <BaseProgress.Root
      data-slot="progress"
      className={cxState(
        styles["progress"],
        progressVariants({ size, color }),
        className,
      )}
      render={<Stack gap={gap} fullwidth={fullwidth} />}
      {...props}
    >
      {children}
    </BaseProgress.Root>
  );
};
ProgressRoot.displayName = "ProgressRoot";
