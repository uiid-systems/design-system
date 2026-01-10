import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const licensePlatePattern: MaskPattern = {
  pattern: "###-###",
  transform: (value) =>
    value.replace(REGEX_CACHE.nonAlphaNumeric, "").toUpperCase(),
  validate: (value) => REGEX_CACHE.licensePlate.test(value),
};
