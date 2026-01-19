"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";

import { cx } from "@uiid/utils";

import { Group } from "@uiid/layout";

import type { SliderRootProps } from "../slider.types";

import { inputVariants } from "../../input/input.variants";
import inputStyles from "../../input/input.module.css";

export const SliderRoot = ({
  ghost,
  fullwidth,
  children,
  className,
  ...props
}: SliderRootProps) => {
  return (
    <BaseSlider.Root
      data-slot="slider-root"
      className={cx(
        inputStyles["input"],
        inputVariants({ ghost, fullwidth }),
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
