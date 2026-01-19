"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";

import { cx } from "@uiid/utils";

import type { SliderIndicatorProps } from "../slider.types";
import styles from "../slider.module.css";

export const SliderIndicator = ({
  className,
  ...props
}: SliderIndicatorProps) => {
  return (
    <BaseSlider.Indicator
      data-slot="slider-indicator"
      className={cx(styles["slider-indicator"], className)}
      {...props}
    />
  );
};
SliderIndicator.displayName = "SliderIndicator";
