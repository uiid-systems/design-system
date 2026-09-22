import type { Slider } from "@base-ui/react/slider";
import type { GroupProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps, WithLayoutProps } from "@uiid/utils";

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
 *
 * `onValueChange` and `onValueCommitted` are restated at their own types, not
 * omitted and replaced. Intersecting appends our note to Base UI's, so the
 * upstream `reason` list survives in the generated props table and the steer
 * lands under it. Which of the two a caller picks is a cost decision the
 * upstream docs do not make, and the props table is where it gets made.
 */
export type SliderRootProps = WithLayoutProps<Slider.Root.Props, GroupProps> &
  SliderVariants & {
    /**
     * Palette hue applied as a solid fill on the filled track and thumb. The
     * unfilled track and the control surface stay on the shade scale.
     */
    color?: SliderColor;
    /**
     * Fires on every step of a drag. Right for cheap per-step work — mirroring
     * the value into local state, moving a preview. Anything that writes,
     * fetches, or navigates belongs on `onValueCommitted` instead.
     */
    onValueChange?: Slider.Root.Props["onValueChange"];
    /**
     * Fires once the interaction settles — pointer release, key lift, track
     * press. The handler to reach for when the work is expensive.
     */
    onValueCommitted?: Slider.Root.Props["onValueCommitted"];
  };
export type SliderLabelProps = Slider.Label.Props;
export type SliderValueProps = Slider.Value.Props;
export type SliderControlProps = WithLayoutProps<
  Slider.Control.Props,
  GroupProps
>;
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
} & Pick<FieldProps, "label" | "description" | "action">;
