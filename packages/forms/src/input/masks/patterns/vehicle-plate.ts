import { patternMask } from "../pattern-mask";

/** A licence plate of six letters or digits, uppercased, `ABC-123`. */
export const licensePlateMask = /* @__PURE__ */ patternMask("XXX-XXX", {
  slots: { X: /[\dA-Z]/ },
  uppercase: true,
});

/** Whether a licence plate, masked or not, has six letters or digits. */
export const isValidLicensePlate = (value: string) =>
  /^[\dA-Z]{3}-?[\dA-Z]{3}$/i.test(value);
