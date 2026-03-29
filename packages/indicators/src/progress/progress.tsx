"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cx } from "@uiid/utils";

import type { ProgressProps } from "./progress.types";
import { progressVariants } from "./progress.variants";
import styles from "./progress.module.css";

export const Progress = ({
  value = 0,
  label,
  size,
  color,
  className,
  RootProps,
  TrackProps,
  IndicatorProps,
  ValueProps,
  LabelProps,
}: ProgressProps) => {
  return (
    <BaseProgress.Root
      data-slot="progress"
      className={cx(
        styles["progress"],
        progressVariants({ size, color }),
        className,
      )}
      value={value}
      {...RootProps}
    >
      {label && (
        <BaseProgress.Label
          data-slot="progress-label"
          className={styles["progress-label"]}
          {...LabelProps}
        >
          {label}
        </BaseProgress.Label>
      )}
      <BaseProgress.Value
        data-slot="progress-value"
        className={styles["progress-value"]}
        {...ValueProps}
      />
      <BaseProgress.Track
        data-slot="progress-track"
        className={styles["progress-track"]}
        {...TrackProps}
      >
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className={styles["progress-indicator"]}
          {...IndicatorProps}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
};
Progress.displayName = "Progress";
