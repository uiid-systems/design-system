import type { MaskPatternKey, MaskPattern } from "../mask-input.types";

export function isCurrencyMask(opts: {
  mask: MaskPatternKey | MaskPattern | undefined;
  pattern?: string;
}): boolean {
  const { mask, pattern } = opts;

  return (
    mask === "currency" ||
    Boolean(pattern && (pattern.includes("$") || pattern.includes("€")))
  );
}
