import { cva } from "@uiid/utils";

import { FIELD_ROW_DEFAULT_SIZE } from "./field.constants";

import styles from "./field.module.css";

/**
 * The control-scale axis for a field row (checkbox, radio, switch).
 *
 * The row does not paint a size of its own — each control sizes itself — so the
 * tier classes only publish `--field-row-padding-*`. That is what `bordered`
 * reads for its inset, which used to be a single `--forms-padding-*` pair and
 * therefore gave a large bordered checkbox the same padding as a small one.
 * Keeping the values on the row rather than on any one control is what lets
 * checkbox, radio and switch share the treatment without one owning it.
 */
export const fieldRowVariants = cva({
  variants: {
    /** Control scale, matching a sibling Input at the same size */
    size: {
      xsmall: styles["row-size-xsmall"],
      small: styles["row-size-small"],
      medium: styles["row-size-medium"],
      large: styles["row-size-large"],
    },
  },
  defaultVariants: {
    size: FIELD_ROW_DEFAULT_SIZE,
  },
});
