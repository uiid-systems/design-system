"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { SliderControlProps } from "../slider.types";

import styles from "../slider.module.css";

export const SliderControl = ({
  children,
  className,
  ...props
}: SliderControlProps) => {
  return (
    <BaseSlider.Control
      data-slot="slider-control"
      render={<Group ay="center" px={3} fullwidth />}
      className={cx(styles["slider-control"], className)}
      {...props}
    >
      {children}
    </BaseSlider.Control>
  );
};
SliderControl.displayName = "SliderControl";
