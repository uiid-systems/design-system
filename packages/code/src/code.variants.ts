import { cva } from "@uiid/utils";

import styles from "./code.module.css";
import { DEFAULT_SHOW_LINE_NUMBERS } from "./code.constants";

/** Shared typography for code components */
export const codeTypographyVariant = cva({
  base: styles["code-typography"],
});

/** Code content variants - includes typography, shiki theme, reset, and line numbers */
export const codeContentVariants = cva({
  base: [styles["code-typography"], styles["shiki-theme"], styles["shiki-reset"]],
  variants: {
    showLineNumbers: {
      true: styles["line-numbers"],
    },
  },
  defaultVariants: {
    showLineNumbers: DEFAULT_SHOW_LINE_NUMBERS,
  },
});

/** Shiki-only variants for elements that need theme/reset without typography */
export const shikiVariants = cva({
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
