"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";

import { cx } from "@uiid/utils";

import type { SliderThumbProps } from "../slider.types";
import styles from "../slider.module.css";

export const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  return (
    <BaseSlider.Thumb
      data-slot="slider-thumb"
      className={cx(styles["slider-thumb"], className)}
      {...props}
    />
  );
};
SliderThumb.displayName = "SliderThumb";
