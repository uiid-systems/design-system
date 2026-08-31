import { cva } from "@uiid/utils";

import { INPUT_GROUP_DEFAULT_SIZE } from "./input-group.constants";

import styles from "./input-group.module.css";

/**
 * The control-scale axis for the input group, which is the strip of actions
 * (Clear, Trigger) overlaying a combobox or autocomplete input.
 *
 * The tier sits on the group root rather than on the input: the actions are not
 * descendants of the control, so the input's own tier class is out of their
 * reach. The class publishes `--input-group-action-height`, which every action
 * in the subtree inherits.
 *
 * Sizing the actions at all is the point — a fixed 2.5rem action stood taller
 * than the control it sat inside at both the xsmall (1.75rem) and small (2rem)
 * tiers, so its focus ring overhung the field.
 */
export const inputGroupVariants = cva({
  variants: {
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: INPUT_GROUP_DEFAULT_SIZE,
  },
});
