import type { Slider } from "@base-ui/react/slider";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { sliderVariants } from "./slider.variants";

export type SliderVariants = VariantProps<typeof sliderVariants>;

export type SliderRootProps = Slider.Root.Props & SliderVariants;
export type SliderLabelProps = Slider.Label.Props;
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
