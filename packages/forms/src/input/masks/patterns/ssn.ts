import { patternMask } from "../pattern-mask";
import { hasDigits } from "./patterns.utils";

/** A US Social Security number, `123-45-6789`. */
export const ssnMask = /* @__PURE__ */ patternMask("###-##-####");

/** Whether a Social Security number, masked or not, has all nine digits. */
export const isValidSsn = (value: string) => hasDigits(value, 9);
