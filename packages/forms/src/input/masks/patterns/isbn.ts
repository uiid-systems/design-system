import { patternMask } from "../pattern-mask";
import { hasDigits } from "./patterns.utils";

/** A hyphenated ISBN-13, `978-0-306-40615-7`. */
export const isbnMask = /* @__PURE__ */ patternMask("###-#-###-#####-#");

/**
 * Whether an ISBN, masked or not, has all thirteen digits. The check digit is
 * not checked.
 */
export const isValidIsbn = (value: string) => hasDigits(value, 13);
