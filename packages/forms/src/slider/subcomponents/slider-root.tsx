"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { SliderRootProps } from "../slider.types";
import { sliderVariants } from "../slider.variants";

import inputStyles from "../../input/input.module.css";

export const SliderRoot = ({
  variant,
  fullwidth,
  size,
  children,
  className,
  ...props
}: SliderRootProps) => {
  return (
    <BaseSlider.Root
      data-slot="slider-root"
      className={cx(
        inputStyles["input"],
        sliderVariants({ variant, fullwidth, size }),
        className,
      )}
      render={<Group gap={2} ay="center" />}
      {...props}
    >
      {children}
    </BaseSlider.Root>
  );
};
SliderRoot.displayName = "SliderRoot";
