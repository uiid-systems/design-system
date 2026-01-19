import { cva } from "@uiid/utils";

import styles from "./code.module.css";
import { DEFAULT_SHOW_LINE_NUMBERS } from "./code.constants";

/** Shared Shiki theme variant - applies dual theme support */
export const shikiThemeVariant = cva({
  base: styles["shiki-theme"],
});

/** Full code content variants - includes shiki theme, reset, and line numbers */
export const codeContentVariants = cva({
  base: [styles["shiki-theme"], styles["shiki-reset"]],
  variants: {
    showLineNumbers: {
      true: styles["line-numbers"],
    },
  },
  defaultVariants: {
    showLineNumbers: DEFAULT_SHOW_LINE_NUMBERS,
  },
});
