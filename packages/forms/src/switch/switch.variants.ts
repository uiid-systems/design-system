import { cva } from "@uiid/utils";

import { SWITCH_DEFAULT_SIZE } from "./switch.constants";

import styles from "./switch.module.css";

/**
 * Switch's own size axis.
 *
 * It cannot borrow Checkbox's tiers the way Radio does: the two share a field
 * row and a `bordered` treatment, but a switch is a track, not a box, so its
 * scale is a width/height pair rather than one square. The tier classes publish
 * `--switch-height` and `--switch-width`; the track, the corner radius, and the
 * thumb's travel all derive from those two, so a tier sets four dimensions by
 * naming two.
 *
 * The medium tier is exactly what the switch measured before the axis existed,
 * so the default renders unchanged.
 */
export const switchVariants = cva({
  variants: {
    /** Control scale, matching a sibling Checkbox at the same size */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: SWITCH_DEFAULT_SIZE,
  },
});
