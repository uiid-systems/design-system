import type { Progress } from "@base-ui/react/progress";
import type { VariantProps } from "@uiid/utils";

import type { progressVariants } from "./progress.variants";

export type ProgressVariants = VariantProps<typeof progressVariants>;

export type ProgressProps = ProgressVariants & {
  /** Current progress value (0–100) */
  value: Progress.Root.Props["value"];
  /** Additional class name */
  className?: string;
  /** Label text displayed above the track */
  label?: string;
  /** Props forwarded to the Base UI Root */
  RootProps?: Omit<Progress.Root.Props, "value">;
  /** Props forwarded to the Base UI Track */
  TrackProps?: Progress.Track.Props;
  /** Props forwarded to the Base UI Indicator */
  IndicatorProps?: Progress.Indicator.Props;
  /** Props forwarded to the Base UI Value */
  ValueProps?: Progress.Value.Props;
  /** Props forwarded to the Base UI Label */
  LabelProps?: Progress.Label.Props;
};
