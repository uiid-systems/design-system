import { cva } from "@uiid/utils";

import styles from "./box.module.css";

export const boxVariants = cva({
  variants: {
    evenly: { true: styles["toggle-evenly"] },
    fullheight: { true: styles["toggle-fullheight"] },
    fullwidth: { true: styles["toggle-fullwidth"] },
    fullscreen: { true: styles["toggle-fullscreen"] },
  },
});
