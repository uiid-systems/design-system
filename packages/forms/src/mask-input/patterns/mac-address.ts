import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const macAddressPattern: MaskPattern = {
  pattern: "##:##:##:##:##:##",
  transform: (value) =>
    value.replace(REGEX_CACHE.nonAlphaNumeric, "").toUpperCase(),
  validate: (value) => REGEX_CACHE.macAddress.test(value),
};
