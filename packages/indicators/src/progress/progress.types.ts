import type { Progress } from "@base-ui/react/progress";
import type { GroupProps, StackProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type {
  VariantProps,
  WithLayoutProps,
  WithStringClassName,
} from "@uiid/utils";

import type { progressVariants } from "./progress.variants";

export type ProgressVariants = VariantProps<typeof progressVariants>;

/**
 * Palette hue for the indicator. The track and the label row stay on the
 * shade scale.
 */
export type ProgressColor = PaletteColor;

/**
 * The root renders a `Stack`, so it takes layout props alongside Base UI's.
 * No `Omit<…, "color">`: `BaseUIComponentProps` already drops `color`, so the
 * hue is declared additively.
 */
export type ProgressRootProps = WithLayoutProps<
  WithStringClassName<Progress.Root.Props>,
  StackProps
> &
  ProgressVariants & {
    /** Palette hue applied as a solid fill on the indicator */
    color?: ProgressColor;
  };
/** The row holding the label and the value readout. Renders a `Group`. */
export type ProgressHeaderProps = GroupProps;
export type ProgressLabelProps = WithStringClassName<Progress.Label.Props>;
export type ProgressValueProps = WithStringClassName<Progress.Value.Props>;
export type ProgressTrackProps = WithStringClassName<Progress.Track.Props>;
export type ProgressIndicatorProps =
  WithStringClassName<Progress.Indicator.Props>;

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
  /** Props forwarded to the row holding the label and value, which Progress places */
  HeaderProps?: Omit<ProgressHeaderProps, "children">;
  /** Props forwarded to the label. Its content is `label`. */
  LabelProps?: Omit<ProgressLabelProps, "children">;
  /** Props forwarded to the value readout */
  ValueProps?: ProgressValueProps;
  /** Props forwarded to the track, which holds Progress's indicator */
  TrackProps?: Omit<ProgressTrackProps, "children">;
  /** Props forwarded to the indicator */
  IndicatorProps?: ProgressIndicatorProps;
};
