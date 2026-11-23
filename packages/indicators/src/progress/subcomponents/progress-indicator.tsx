"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cx } from "@uiid/utils";

import type { ProgressIndicatorProps } from "../progress.types";

import styles from "../progress.module.css";

export const ProgressIndicator = ({
  className,
  ...props
}: ProgressIndicatorProps) => {
  return (
    <BaseProgress.Indicator
      data-slot="progress-indicator"
      className={cx(styles["progress-indicator"], className)}
      {...props}
    />
  );
};
ProgressIndicator.displayName = "ProgressIndicator";
