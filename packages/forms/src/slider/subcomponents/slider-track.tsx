import { Slider as BaseSlider } from "@base-ui-components/react/slider";

import { cx } from "@uiid/utils";

import styles from "../slider.module.css";

import type { SliderTrackProps } from "../slider.types";

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
