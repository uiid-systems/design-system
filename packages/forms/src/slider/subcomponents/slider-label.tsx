"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";

import type { SliderLabelProps } from "../slider.types";

export const SliderLabel = ({ children, ...props }: SliderLabelProps) => {
  return (
    <BaseSlider.Label data-slot="slider-label" {...props}>
      {children}
    </BaseSlider.Label>
  );
};
SliderLabel.displayName = "SliderLabel";
