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
  action,
  RootProps,
  ValueProps,
  ControlProps,
  TrackProps,
  IndicatorProps,
  ThumbProps,
  FieldProps,
  ...props
}: SliderProps) => {
  // Top-level props win over the same key in RootProps, as in Switch and
  // NumberField. The Field reads name and size from the merged root props so
  // its chrome matches the control.
  const rootProps = { ...RootProps, ...props };
  const { name, size } = rootProps;

  // One thumb per value. Base UI takes a number for a single slider and an
  // array for a range; `index` is what lets a range render server-side.
  const resolvedValue = rootProps.value ?? rootProps.defaultValue;
  const thumbCount = Array.isArray(resolvedValue) ? resolvedValue.length : 1;

  return (
    <Field
      name={name}
      label={label}
      description={description}
      action={action}
      size={size}
      {...FieldProps}
    >
      <SliderRoot {...rootProps}>
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
