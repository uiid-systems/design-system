"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Group } from "@uiid/layout";

import type { SliderControlProps } from "../slider.types";

import styles from "../slider.module.css";

export const SliderControl = ({ children, ...props }: SliderControlProps) => {
  return (
    <BaseSlider.Control
      data-slot="slider-control"
      render={<Group ay="center" px={3} fullwidth />}
      className={styles["slider-control"]}
      {...props}
    >
      {children}
    </BaseSlider.Control>
  );
};
SliderControl.displayName = "SliderControl";
