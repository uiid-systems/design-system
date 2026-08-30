import { cva } from "@uiid/utils";

import checkboxStyles from "../checkbox/checkbox.module.css";

/**
 * Radio and Checkbox share one control surface, so Radio paints with the
 * checkbox styles rather than duplicating them — the sanctioned way to share
 * variant styling.
 *
 * This is still Radio's own variant definition. `RadioVariants` used to alias
 * `CheckboxVariants` wholesale, which meant any variant added to Checkbox
 * silently appeared on Radio's public type whether or not a matching style
 * existed.
 */
export const radioVariants = cva({
  variants: {
    bordered: { true: checkboxStyles["toggle-bordered"] },
    reversed: { true: checkboxStyles["toggle-reversed"] },
    size: {
      small: checkboxStyles["size-small"],
      medium: checkboxStyles["size-medium"],
      large: checkboxStyles["size-large"],
    },
  },
});
