import type { Slider } from "@base-ui-components/react/slider";

export type SliderRootProps = Slider.Root.Props;
export type SliderValueProps = Slider.Value.Props;
export type SliderControlProps = Slider.Control.Props;
export type SliderTrackProps = Slider.Track.Props;
export type SliderIndicatorProps = Slider.Indicator.Props;
export type SliderThumbProps = Slider.Thumb.Props;

export type SliderProps = SliderRootProps & {
  RootProps?: SliderRootProps;
  ValueProps?: SliderValueProps;
  ControlProps?: SliderControlProps;
  TrackProps?: SliderTrackProps;
  IndicatorProps?: SliderIndicatorProps;
  ThumbProps?: SliderThumbProps;
};
