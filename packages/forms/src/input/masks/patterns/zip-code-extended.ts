import { patternMask } from "../pattern-mask";
import { hasDigits } from "./patterns.utils";

/** A ZIP+4 code, `12345-6789`. */
export const zipCodeExtendedMask = /* @__PURE__ */ patternMask("#####-####");

/** Whether a ZIP+4 code, masked or not, has all nine digits. */
export const isValidZipCodeExtended = (value: string) => hasDigits(value, 9);
