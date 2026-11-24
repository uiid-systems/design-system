import { cva } from "@uiid/utils";

import { TABLE_DEFAULT_SIZE } from "./table.constants";

import styles from "./table.module.css";

export const tableVariants = cva({
  variants: {
    /** Row rhythm — row height, font size and cell padding follow the form-control tiers */
    size: {
      xsmall: styles["size-xsmall"],
      small: styles["size-small"],
      medium: styles["size-medium"],
      large: styles["size-large"],
    },
    /** Shade every even body row */
    striped: { true: styles["striped"] },
    /** Rule a border between body rows */
    bordered: { true: styles["bordered"] },
    /** Highlight a body row under the pointer */
    highlightOnHover: { true: styles["highlight-on-hover"] },
  },
  defaultVariants: {
    size: TABLE_DEFAULT_SIZE,
  },
});
