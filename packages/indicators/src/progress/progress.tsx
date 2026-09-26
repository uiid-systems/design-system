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
  label,
  hideValue = false,
  RootProps,
  HeaderProps,
  LabelProps,
  ValueProps,
  TrackProps,
  IndicatorProps,
  ...props
}: ProgressProps) => {
  const hasLabel = label != null && label !== false && label !== "";
  const hasHeader = hasLabel || !hideValue;

  /*
   * `value` passes through untouched, as Base UI requires it: `null` is the
   * indeterminate state, so defaulting it would make that state unreachable.
   * The header row only renders when it holds something, so a bare bar (the
   * compact toast case) is just the track.
   */
  return (
    <ProgressRoot {...props} {...RootProps}>
      {hasHeader && (
        <ProgressHeader {...HeaderProps}>
          {hasLabel && <ProgressLabel {...LabelProps}>{label}</ProgressLabel>}
          {!hideValue && <ProgressValue {...ValueProps} />}
        </ProgressHeader>
      )}
      <ProgressTrack {...TrackProps}>
        <ProgressIndicator {...IndicatorProps} />
      </ProgressTrack>
    </ProgressRoot>
  );
};
Progress.displayName = "Progress";
