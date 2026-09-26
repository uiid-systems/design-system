import type { Progress } from "@base-ui/react/progress";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { VariantProps, WithLayoutProps } from "@uiid/utils";

import type { progressVariants } from "./progress.variants";

export type ProgressVariants = VariantProps<typeof progressVariants>;

/**
 * The root renders a `Stack`, so it takes layout props alongside Base UI's.
 * No `Omit<…, "color">`: `BaseUIComponentProps` already drops `color`, so the
 * variant's `color` is declared additively.
 */
export type ProgressRootProps = WithLayoutProps<
  Progress.Root.Props,
  StackProps
> &
  ProgressVariants;
/** The row holding the label and the value readout. Renders a `Group`. */
export type ProgressHeaderProps = GroupProps;
export type ProgressLabelProps = Progress.Label.Props;
export type ProgressValueProps = Progress.Value.Props;
export type ProgressTrackProps = Progress.Track.Props;
export type ProgressIndicatorProps = Progress.Indicator.Props;

export type ProgressProps = Omit<ProgressRootProps, "children"> & {
  /** Names the progress bar; rendered above the track, start-aligned */
  label?: React.ReactNode;
  /**
   * Hide the numeric readout. The value still reaches assistive tech through
   * `aria-valuenow` and `aria-valuetext`, so this is a visual choice only.
   */
  hideValue?: boolean;
  /** Props forwarded to the root */
  RootProps?: Omit<ProgressRootProps, "value">;
  /** Props forwarded to the row holding the label and value */
  HeaderProps?: ProgressHeaderProps;
  /** Props forwarded to the label */
  LabelProps?: ProgressLabelProps;
  /** Props forwarded to the value readout */
  ValueProps?: ProgressValueProps;
  /** Props forwarded to the track */
  TrackProps?: ProgressTrackProps;
  /** Props forwarded to the indicator */
  IndicatorProps?: ProgressIndicatorProps;
};
