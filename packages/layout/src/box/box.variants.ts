import { cva } from "@uiid/utils";

import styles from "./box.module.css";

export const boxVariants = cva({
  variants: {
    evenly: { true: styles["toggle-evenly"] },
    rounded: { true: styles["toggle-rounded"] },
    square: { true: styles["toggle-square"] },
    fullheight: { true: styles["toggle-fullheight"] },
    fullwidth: { true: styles["toggle-fullwidth"] },
    fullscreen: { true: styles["toggle-fullscreen"] },
  },
});
