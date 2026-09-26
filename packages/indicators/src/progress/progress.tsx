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
  // Base UI prints nothing while indeterminate, unless a render function
  // supplies its own readout.
  const indeterminate = props.value == null || !Number.isFinite(props.value);
  const hasReadout = !hideValue && (!indeterminate || !!ValueProps?.children);
  const hasHeader = hasLabel || hasReadout;

  /*
   * `value` passes through untouched, as Base UI requires it: `null` is the
   * indeterminate state, so defaulting it would make that state unreachable.
   * The header row only renders when it holds something, so a bare bar (the
   * compact toast case, or an unlabelled indeterminate one) is just the track.
   */
  return (
    <ProgressRoot {...props} {...RootProps}>
      {hasHeader && (
        <ProgressHeader {...HeaderProps}>
          {hasLabel && <ProgressLabel {...LabelProps}>{label}</ProgressLabel>}
          {hasReadout && <ProgressValue {...ValueProps} />}
        </ProgressHeader>
      )}
      <ProgressTrack {...TrackProps}>
        <ProgressIndicator {...IndicatorProps} />
      </ProgressTrack>
    </ProgressRoot>
  );
};
Progress.displayName = "Progress";
