import type { Slider } from "@base-ui/react/slider";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";

export type SliderVariants = InputVariants;

export type SliderRootProps = Slider.Root.Props &
  Pick<SliderVariants, "ghost" | "fullwidth">;
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
  FieldProps?: FieldProps;
} & Pick<FieldProps, "label" | "description">;
