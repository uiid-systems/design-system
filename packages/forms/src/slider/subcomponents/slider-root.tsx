import { Slider as BaseSlider } from "@base-ui/react/slider";

import { Group } from "@uiid/layout";

import type { SliderRootProps } from "../slider.types";

export const SliderRoot = ({ children, ...props }: SliderRootProps) => {
  return (
    <BaseSlider.Root
      data-slot="slider-root"
      render={<Group gap={2} ay="center" />}
      {...props}
    >
      {children}
    </BaseSlider.Root>
  );
};
SliderRoot.displayName = "SliderRoot";
