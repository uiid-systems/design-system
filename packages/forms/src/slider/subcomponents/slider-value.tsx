"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Text } from "@uiid/typography";
import { cxState } from "@uiid/utils";

import type { SliderValueProps } from "../slider.types";

import styles from "../slider.module.css";

/**
 * Base UI's contract is
 * `children?: (formattedValues: readonly string[], values: readonly number[]) => ReactNode`,
 * and with no children it renders the formatted values joined with an en dash —
 * which is what makes a range slider read correctly.
 *
 * This wrapper previously hijacked `render` to apply the Text treatment, which
 * discarded `children` entirely and printed `values[0]`, so a consumer's render
 * function silently did nothing and only the first thumb's value was ever shown.
 * Passing `render` an element instead lets Base UI merge onto it and leaves the
 * children contract intact.
 *
 * The class hands the font size back to the root, so the readout follows the
 * slider's size tier rather than Text's default size.
 */
export const SliderValue = ({
  children,
  className,
  ...props
}: SliderValueProps) => {
  return (
    <BaseSlider.Value
      data-slot="slider-value"
      render={<Text weight="bold" />}
      className={cxState(styles["slider-value"], className)}
      {...props}
    >
      {children}
    </BaseSlider.Value>
  );
};
SliderValue.displayName = "SliderValue";
