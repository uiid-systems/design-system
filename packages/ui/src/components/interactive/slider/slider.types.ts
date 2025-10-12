import type { Slider } from "@base-ui-components/react/slider";

export type SliderProps = {
  RootProps?: Slider.Root.Props;
  ValueProps?: Slider.Value.Props;
  ControlProps?: Slider.Control.Props;
  TrackProps?: Slider.Track.Props;
  IndicatorProps?: Slider.Indicator.Props;
  ThumbProps?: Slider.Thumb.Props;
};
