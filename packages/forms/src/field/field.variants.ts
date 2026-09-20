import { cva } from "@uiid/utils";

import { FIELD_DEFAULT_SIZE, FIELD_ROW_DEFAULT_SIZE } from "./field.constants";

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

/**
 * The control-scale axis for a field's own chrome — its label, description and
 * error, and the gap stacking them against the control.
 *
 * Chrome annotates a control, so it is sized against that control rather than
 * against the page. Each tier therefore publishes the same
 * `--forms-size-*-font-size` the control itself reads, which is what keeps a
 * label and the text inside its input from drifting apart. Nothing here paints
 * a font size directly: the tier publishes, `.field-root` applies.
 */
export const fieldVariants = cva({
  variants: {
    /** Control scale, matching the control the field wraps */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: FIELD_DEFAULT_SIZE,
  },
});
