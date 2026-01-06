"use client";

import { ConditionalRender } from "@uiid/layout";

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
  name,
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
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          name={name}
          label={label}
          description={description}
          {...FieldProps}
        />
      }
    >
      <SliderRoot name={name} {...props} {...RootProps}>
        <SliderControl {...ControlProps}>
          <SliderTrack {...TrackProps}>
            <SliderIndicator {...IndicatorProps} />
            <SliderThumb {...ThumbProps} />
          </SliderTrack>
        </SliderControl>
        <SliderValue {...ValueProps} />
      </SliderRoot>
    </ConditionalRender>
  );
};
Slider.displayName = "Slider";
