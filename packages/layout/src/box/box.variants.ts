import { cva } from "@uiid/utils";

import styles from "./box.module.css";

export const boxVariants = cva({
  variants: {
    /** Draw a 1px border on all sides */
    bordered: { true: styles["toggle-bordered"] },
    /** Distribute children evenly along the main axis */
    evenly: { true: styles["toggle-evenly"] },
    /** Round the corners with the base radius */
    rounded: { true: styles["toggle-rounded"] },
    /** Constrain to a 1:1 aspect ratio */
    square: { true: styles["toggle-square"] },
    /** Stretch to fill the container height */
    fullheight: { true: styles["toggle-fullheight"] },
    /** Stretch to fill the container width */
    fullwidth: { true: styles["toggle-fullwidth"] },
    /** Fill the viewport */
    fullscreen: { true: styles["toggle-fullscreen"] },
  },
});
