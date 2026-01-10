export { phonePattern } from "./phone";
export { ssnPattern } from "./ssn";
export { datePattern } from "./date";
export { timePattern } from "./time";
export { creditCardPattern } from "./credit-card";
export { creditCardExpiryPattern } from "./credit-card-expiry";
export { zipCodePattern } from "./zip-code";
export { zipCodeExtendedPattern } from "./zip-code-extended";
export { currencyPattern } from "./currency";
export { percentagePattern } from "./percentage";
export { licensePlatePattern } from "./license-plate";
export { ipv4Pattern } from "./ipv4";
export { macAddressPattern } from "./mac-address";
export { isbnPattern } from "./isbn";
export { einPattern } from "./ein";

import type { MaskPattern, MaskPatternKey } from "../mask-input.types";

import { phonePattern } from "./phone";
import { ssnPattern } from "./ssn";
import { datePattern } from "./date";
import { timePattern } from "./time";
import { creditCardPattern } from "./credit-card";
import { creditCardExpiryPattern } from "./credit-card-expiry";
import { zipCodePattern } from "./zip-code";
import { zipCodeExtendedPattern } from "./zip-code-extended";
import { currencyPattern } from "./currency";
import { percentagePattern } from "./percentage";
import { licensePlatePattern } from "./license-plate";
import { ipv4Pattern } from "./ipv4";
import { macAddressPattern } from "./mac-address";
import { isbnPattern } from "./isbn";
import { einPattern } from "./ein";

/**
 * Map of all mask patterns keyed by pattern name.
 * Import individual patterns for better tree-shaking.
 */
export const MASK_PATTERNS: Record<MaskPatternKey, MaskPattern> = {
  phone: phonePattern,
  ssn: ssnPattern,
  date: datePattern,
  time: timePattern,
  creditCard: creditCardPattern,
  creditCardExpiry: creditCardExpiryPattern,
  zipCode: zipCodePattern,
  zipCodeExtended: zipCodeExtendedPattern,
  currency: currencyPattern,
  percentage: percentagePattern,
  licensePlate: licensePlatePattern,
  ipv4: ipv4Pattern,
  macAddress: macAddressPattern,
  isbn: isbnPattern,
  ein: einPattern,
};
