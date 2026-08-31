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
  name,
  value,
  defaultValue,
  RootProps,
  ValueProps,
  ControlProps,
  TrackProps,
  IndicatorProps,
  ThumbProps,
  FieldProps,
  ...props
}: SliderProps) => {
  // One thumb per value. Base UI takes a number for a single slider and an
  // array for a range; `index` is what lets a range render server-side.
  const resolvedValue =
    value ?? defaultValue ?? RootProps?.value ?? RootProps?.defaultValue;
  const thumbCount = Array.isArray(resolvedValue) ? resolvedValue.length : 1;

  return (
    <Field name={name} label={label} description={description} {...FieldProps}>
      <SliderRoot
        name={name}
        value={value}
        defaultValue={defaultValue}
        {...props}
        {...RootProps}
      >
        <SliderControl {...ControlProps}>
          <SliderTrack {...TrackProps}>
            <SliderIndicator {...IndicatorProps} />
            {Array.from({ length: thumbCount }, (_, index) => (
              <SliderThumb key={index} index={index} {...ThumbProps} />
            ))}
          </SliderTrack>
        </SliderControl>
        <SliderValue {...ValueProps} />
      </SliderRoot>
    </Field>
  );
};
Slider.displayName = "Slider";
