"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cx } from "@uiid/utils";

import type { SliderTrackProps } from "../slider.types";

import styles from "../slider.module.css";

export const SliderTrack = ({
  children,
  className,
  ...props
}: SliderTrackProps) => {
  return (
    <BaseSlider.Track
      data-slot="slider-track"
      className={cx(styles["slider-track"], className)}
      {...props}
    >
      {children}
    </BaseSlider.Track>
  );
};
SliderTrack.displayName = "SliderTrack";
