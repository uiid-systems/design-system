import { MASK_INPUT_REGEX } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const licensePlatePattern: MaskPattern = {
  pattern: "###-###",
  transform: (value) =>
    value.replace(MASK_INPUT_REGEX.nonAlphaNumeric, "").toUpperCase(),
  validate: (value) => MASK_INPUT_REGEX.licensePlate.test(value),
};
