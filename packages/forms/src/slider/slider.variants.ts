import { cva } from "@uiid/utils";

import { SLIDER_DEFAULT_SIZE } from "./slider.constants";

import inputStyles from "../input/input.module.css";
import styles from "./slider.module.css";

/**
 * Slider's root is a control surface like any other form control, so it paints
 * with Input's styles rather than duplicating them — the sanctioned way to
 * share variant styling, as `select-trigger.tsx` does.
 *
 * This is still Slider's own variant definition. `SliderVariants` used to alias
 * `InputVariants` wholesale while `SliderRootProps` picked only `ghost` and
 * `fullwidth` from it, so `size` reached the class list solely through
 * `inputVariants`' own `defaultVariants` — every slider rendered at the medium
 * tier with no way to ask for another one. Declaring the axis here makes that
 * behavior explicit and gives the tier a prop.
 *
 * The size classes are Slider's own. Each composes the same tier Input does,
 * so the row height, inline padding and readout still match a sibling Input,
 * and adds the thumb and track dimensions for that tier.
 */
export const sliderVariants = cva({
  variants: {
    /** Stretch the control to the width of its container */
    fullwidth: { true: inputStyles["toggle-fullwidth"] },
    /** Surface treatment — filled by default, `ghost` drops the resting surface */
    variant: {
      ghost: inputStyles["variant-ghost"],
    },
    /** Control scale, matching a sibling Input at the same size */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: SLIDER_DEFAULT_SIZE,
  },
});
