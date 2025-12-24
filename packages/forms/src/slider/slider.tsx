"use client";

import type { SliderProps } from "./slider.types";

import {
  SliderRoot,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
} from "./subcomponents";

export const Slider = ({
  RootProps,
  ValueProps,
  ControlProps,
  TrackProps,
  IndicatorProps,
  ThumbProps,
  ...props
}: SliderProps) => {
  return (
    <SliderRoot {...props} {...RootProps}>
      <SliderValue {...ValueProps} />
      <SliderControl {...ControlProps}>
        <SliderTrack {...TrackProps}>
          <SliderIndicator {...IndicatorProps} />
          <SliderThumb {...ThumbProps} />
        </SliderTrack>
      </SliderControl>
    </SliderRoot>
  );
};
Slider.displayName = "Slider";
