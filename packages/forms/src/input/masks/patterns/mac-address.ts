import { patternMask } from "../pattern-mask";

/** A MAC address of six hex pairs, uppercased, `00:1A:2B:FF:4C:5D`. */
export const macAddressMask = /* @__PURE__ */ patternMask("HH:HH:HH:HH:HH:HH", {
  slots: { H: /[\dA-F]/ },
  uppercase: true,
});

/**
 * Whether a MAC address has all twelve hex digits, either as six colon-joined
 * pairs or as twelve bare digits.
 */
export const isValidMacAddress = (value: string) =>
  /^(?:[\dA-F]{2}(?::[\dA-F]{2}){5}|[\dA-F]{12})$/i.test(value);
