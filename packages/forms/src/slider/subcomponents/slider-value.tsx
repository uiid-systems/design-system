"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import NumberFlow from "@number-flow/react";

import { Text } from "@uiid/typography";

import type { SliderValueProps } from "../slider.types";

export const SliderValue = ({ ...props }: SliderValueProps) => {
  return (
    <BaseSlider.Value
      data-slot="slider-value"
      render={(valueProps, state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { children, ...restProps } = valueProps;
        return (
          <Text
            render={<NumberFlow {...restProps} value={state.values[0]} />}
            weight="bold"
          />
        );
      }}
      {...props}
    />
  );
};
SliderValue.displayName = "SliderValue";
