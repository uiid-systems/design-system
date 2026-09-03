import { cva } from "@uiid/utils";

import { TABS_DEFAULT_SIZE } from "./tabs.constants";

import styles from "./tabs.module.css";

/**
 * The tier rides the list rather than the individual tabs: `TabsTab` never sees
 * `size`, and `composes` only applies to the class that declares it, so the
 * list composes the tier and republishes what its tabs need as custom
 * properties. Height and font-size come straight from the composition; inline
 * padding is handed down as `--tabs-tab-padding-x` because it belongs to the
 * tabs, not to the container box they sit in.
 */
export const tabsListVariants = cva({
  variants: {
    /** Control size, matches form-control rows */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
  },
  defaultVariants: {
    size: TABS_DEFAULT_SIZE,
  },
});
