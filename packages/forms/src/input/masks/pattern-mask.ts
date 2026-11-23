import type { MaskitoOptions, MaskitoPreprocessor } from "@maskito/core";

import type { InputMask } from "../input.types";
import { maskitoMask } from "./maskito-mask";
import type { PatternMaskOptions } from "./pattern-mask.types";

const upper: MaskitoPreprocessor = ({ elementState, data }) => ({
  elementState: { ...elementState, value: elementState.value.toUpperCase() },
  data: data.toUpperCase(),
});

/**
 * A mask for text of a fixed shape, for `Input`'s `mask` prop. Each `#` in the
 * template takes one digit, and every other character is a literal the mask
 * writes itself, once a character follows it: `"(###) ###-####"` turns `1234`
 * into `(123) 4`. Characters no slot takes are dropped, and nothing goes past
 * the end of the template.
 *
 * The value stays the masked string. `parse` returns the characters typed
 * without the literals, so `parse("(123) 4")` is `"1234"`, and `format` turns
 * them back into the masked string. Both accept either form.
 *
 * Keep a literal that a slot would take out of the template. In
 * `"+1 (###) ###-####"` a typed `1` is read as the literal `1`, so it is lost.
 *
 * Create the mask once, at module scope or in `useMemo`. `Input` attaches a
 * new mask whenever it receives a different object, so calling this during
 * render re-attaches the mask on every render.
 *
 * @example
 * const orderNumber = patternMask("AA-####", { slots: { A: /[A-Z]/ }, uppercase: true });
 *
 * <Input mask={orderNumber} onValueChange={(masked) => setOrder(orderNumber.parse(masked))} />
 */
export function patternMask(
  template: string,
  { slots, uppercase = false, inputMode }: PatternMaskOptions = {},
): InputMask<string> {
  const slotFor: Record<string, RegExp> = { "#": /\d/, ...slots };
  const expression = [...template].map((char) => slotFor[char] ?? char);
  const isSlot = expression.map((part) => typeof part !== "string");

  const options: MaskitoOptions = {
    mask: expression,
    preprocessors: uppercase ? [upper] : [],
  };

  return maskitoMask(options, {
    inputMode:
      inputMode ?? (Object.keys(slots ?? {}).length ? undefined : "numeric"),
    parse: (formatted) =>
      [...formatted].filter((_, index) => isSlot[index]).join(""),
  });
}
