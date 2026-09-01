import { cva } from "@uiid/utils";

import checkboxStyles from "../checkbox/checkbox.module.css";
import styles from "./radio.module.css";

/**
 * Radio and Checkbox share one control surface, so Radio paints with the
 * checkbox styles rather than duplicating them — the sanctioned way to share
 * variant styling.
 *
 * This is still Radio's own variant definition. `RadioVariants` used to alias
 * `CheckboxVariants` wholesale, which meant any variant added to Checkbox
 * silently appeared on Radio's public type whether or not a matching style
 * existed.
 *
 * `size` is the one tier that cannot come from Checkbox alone: the box scales
 * with Checkbox's class, but the indicator dot is Radio's own, so each tier
 * also pulls in the matching class from `radio.module.css`.
 */
export const radioVariants = cva({
  variants: {
    bordered: { true: checkboxStyles["toggle-bordered"] },
    reversed: { true: checkboxStyles["toggle-reversed"] },
    size: {
      xsmall: [checkboxStyles["size-xsmall"], styles["size-xsmall"]],
      small: [checkboxStyles["size-small"], styles["size-small"]],
      medium: [checkboxStyles["size-medium"], styles["size-medium"]],
      large: [checkboxStyles["size-large"], styles["size-large"]],
    },
  },
});
