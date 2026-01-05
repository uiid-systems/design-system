"use client";

import { Field } from "../field/field";

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
  label,
  description,
  RootProps,
  ValueProps,
  ControlProps,
  TrackProps,
  IndicatorProps,
  ThumbProps,
  FieldProps,
  ...props
}: SliderProps) => {
  return (
    <Field label={label} description={description} {...FieldProps}>
      <SliderRoot {...props} {...RootProps}>
        <SliderControl {...ControlProps}>
          <SliderTrack {...TrackProps}>
            <SliderIndicator {...IndicatorProps} />
            <SliderThumb {...ThumbProps} />
          </SliderTrack>
        </SliderControl>
        <SliderValue {...ValueProps} />
      </SliderRoot>
    </Field>
  );
};
Slider.displayName = "Slider";
