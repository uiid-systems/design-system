"use client";

import type { ProgressProps } from "./progress.types";
import {
  ProgressRoot,
  ProgressHeader,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
} from "./subcomponents";

export const Progress = ({
  value = 0,
  label,
  RootProps,
  HeaderProps,
  LabelProps,
  ValueProps,
  TrackProps,
  IndicatorProps,
  ...props
}: ProgressProps) => {
  return (
    <ProgressRoot value={value} {...props} {...RootProps}>
      <ProgressHeader {...HeaderProps}>
        {label && <ProgressLabel {...LabelProps}>{label}</ProgressLabel>}
        <ProgressValue {...ValueProps} />
      </ProgressHeader>
      <ProgressTrack {...TrackProps}>
        <ProgressIndicator {...IndicatorProps} />
      </ProgressTrack>
    </ProgressRoot>
  );
};
Progress.displayName = "Progress";
