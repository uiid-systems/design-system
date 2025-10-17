import { Slider as BaseSlider } from "@base-ui-components/react/slider";

import { Group } from "@uiid/layout";

import type { SliderProps } from "./slider.types";
import styles from "./slider.module.css";

export const Slider = ({
  RootProps,
  ValueProps,
  ControlProps,
  TrackProps,
  IndicatorProps,
  ThumbProps,
}: SliderProps) => {
  return (
    <BaseSlider.Root {...RootProps}>
      <BaseSlider.Value {...ValueProps} />

      <BaseSlider.Control
        className={styles["slider-control"]}
        {...ControlProps}
        render={<Group ay="center" px={3} />}
      >
        <BaseSlider.Track className={styles["slider-track"]} {...TrackProps}>
          <BaseSlider.Indicator
            className={styles["slider-indicator"]}
            {...IndicatorProps}
          />
          <BaseSlider.Thumb
            className={styles["slider-thumb"]}
            {...ThumbProps}
          />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
};
Slider.displayName = "Slider";
