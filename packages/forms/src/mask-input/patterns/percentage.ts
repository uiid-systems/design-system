import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const percentagePattern: MaskPattern = {
  pattern: "##.##%",
  transform: (value) => {
    const cleaned = value.replace(REGEX_CACHE.percentageChars, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return `${parts[0]}.${parts.slice(1).join("")}`;
    }
    if (parts[1] && parts[1].length > 2) {
      return `${parts[0]}.${parts[1].substring(0, 2)}`;
    }
    return cleaned;
  },
  validate: (value, opts = {}) => {
    const num = parseFloat(value);
    const min = opts.min ?? 0;
    const max = opts.max ?? 100;
    return !Number.isNaN(num) && num >= min && num <= max;
  },
};
