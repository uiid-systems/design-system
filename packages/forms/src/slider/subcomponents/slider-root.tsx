"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Group } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import type { SliderRootProps } from "../slider.types";
import { sliderVariants } from "../slider.variants";

import inputStyles from "../../input/input.module.css";
import styles from "../slider.module.css";

export const SliderRoot = ({
  variant,
  fullwidth,
  size,
  color,
  children,
  className,
  ...props
}: SliderRootProps) => {
  /*
   * Slider's own `.color`, not Input's. The root wears Input's surface, but a
   * hue here marks the filled track rather than tinting the surface the track
   * sits on — so this is the fill treatment, and the field surface stays
   * neutral. The root is an ancestor of track, indicator and thumb, so one
   * class cascades to all three.
   */
  const colorClassName = paletteClassName(color, styles["color"]);

  return (
    <BaseSlider.Root
      data-slot="slider-root"
      className={cx(
        inputStyles["input"],
        sliderVariants({ variant, fullwidth, size }),
        colorClassName,
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
