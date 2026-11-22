import { patternMask } from "../pattern-mask";
import { hasDigits } from "./patterns.utils";

/** A US Employer Identification Number, `12-3456789`. */
export const einMask = /* @__PURE__ */ patternMask("##-#######");

/** Whether an EIN, masked or not, has all nine digits. */
export const isValidEin = (value: string) => hasDigits(value, 9);
