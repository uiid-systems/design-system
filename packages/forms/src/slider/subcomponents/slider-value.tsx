"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import { Text } from "@uiid/typography";

import type { SliderValueProps } from "../slider.types";

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
 */
export const SliderValue = ({ children, ...props }: SliderValueProps) => {
  return (
    <BaseSlider.Value
      data-slot="slider-value"
      render={<Text weight="bold" />}
      {...props}
    >
      {children}
    </BaseSlider.Value>
  );
};
SliderValue.displayName = "SliderValue";
