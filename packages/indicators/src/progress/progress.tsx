"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";

import type { ProgressProps } from "./progress.types";
import styles from "./progress.module.css";

export const Progress = ({
  value = 0,
  RootProps,
  TrackProps,
  IndicatorProps,
  ValueProps,
  LabelProps,
}: ProgressProps) => {
  return (
    <BaseProgress.Root className={styles.Progress} value={value} {...RootProps}>
      <BaseProgress.Label className={styles.Label} {...LabelProps}>
        Export data
      </BaseProgress.Label>
      <BaseProgress.Value className={styles.Value} {...ValueProps} />
      <BaseProgress.Track className={styles.Track} {...TrackProps}>
        <BaseProgress.Indicator
          className={styles.Indicator}
          {...IndicatorProps}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
};
Progress.displayName = "Progress";
