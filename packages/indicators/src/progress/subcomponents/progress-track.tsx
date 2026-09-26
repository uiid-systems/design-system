"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cxState } from "@uiid/utils";

import type { ProgressTrackProps } from "../progress.types";

import styles from "../progress.module.css";

export const ProgressTrack = ({
  children,
  className,
  ...props
}: ProgressTrackProps) => {
  return (
    <BaseProgress.Track
      data-slot="progress-track"
      className={cxState(styles["progress-track"], className)}
      {...props}
    >
      {children}
    </BaseProgress.Track>
  );
};
ProgressTrack.displayName = "ProgressTrack";
