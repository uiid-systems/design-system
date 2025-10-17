import type { Progress } from "@base-ui-components/react/progress";

export type ProgressProps = {
  value: Progress.Root.Props["value"];
  RootProps?: Omit<Progress.Root.Props, "value">;
  TrackProps?: Progress.Track.Props;
  IndicatorProps?: Progress.Indicator.Props;
  ValueProps?: Progress.Value.Props;
  LabelProps?: Progress.Label.Props;
};
