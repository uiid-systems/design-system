import { Slider as BaseSlider } from "@base-ui-components/react/slider";

import type { SliderValueProps } from "../slider.types";

export const SliderValue = ({ ...props }: SliderValueProps) => {
  return <BaseSlider.Value {...props} />;
};
SliderValue.displayName = "SliderValue";
