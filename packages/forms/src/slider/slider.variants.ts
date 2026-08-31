import { cva } from "@uiid/utils";

import { SLIDER_DEFAULT_SIZE } from "./slider.constants";

import inputStyles from "../input/input.module.css";

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
 * Only the row height, inline padding and readout scale with the tier. The
 * track and thumb are a fixed scale, which is what keeps a small slider's grab
 * target usable.
 */
export const sliderVariants = cva({
  variants: {
    /** Stretch the control to the width of its container */
    fullwidth: { true: inputStyles["toggle-fullwidth"] },
    /** Drop the resting surface — background and border only */
    ghost: { true: inputStyles["toggle-ghost"] },
    /** Control scale, matching a sibling Input at the same size */
    size: {
      small: inputStyles["size-small"],
      medium: inputStyles["size-medium"],
      large: inputStyles["size-large"],
    },
  },
  defaultVariants: {
    size: SLIDER_DEFAULT_SIZE,
  },
});
