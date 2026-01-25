"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";

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
          <Text weight="bold" {...restProps}>
            {state.values[0]}
          </Text>
        );
      }}
      {...props}
    />
  );
};
SliderValue.displayName = "SliderValue";
