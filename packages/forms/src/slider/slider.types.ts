import type { Slider } from "@base-ui/react/slider";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { sliderVariants } from "./slider.variants";

export type SliderVariants = VariantProps<typeof sliderVariants>;

/**
 * Palette hue for the filled track. One hue resolves the indicator and the
 * thumb together; the unfilled track and the surrounding surface stay neutral.
 */
export type SliderColor = PaletteColor;

/**
 * No `Omit<…, "color">` here, unlike Button and Card. Those wrap a native
 * element and inherit React's `color` attribute; Base UI's props do not —
 * `BaseUIComponentProps` already omits `color` (alongside `className` and
 * `style`) before a component ever extends it. So the hue is declared
 * additively, and an `Omit` would be a no-op dressed up as a guard.
 */
export type SliderRootProps = Slider.Root.Props &
  SliderVariants & {
    /**
     * Palette hue applied as a solid fill on the filled track and thumb. The
     * unfilled track and the control surface stay on the shade scale.
     */
    color?: SliderColor;
  };
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
