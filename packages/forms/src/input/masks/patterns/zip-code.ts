import { patternMask } from "../pattern-mask";
import { hasDigits } from "./patterns.utils";

/** A five-digit US ZIP code, `12345`. */
export const zipCodeMask = /* @__PURE__ */ patternMask("#####");

/** Whether a ZIP code has all five digits. */
export const isValidZipCode = (value: string) => hasDigits(value, 5);
