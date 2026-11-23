import { Maskito, maskitoTransform } from "@maskito/core";
import type { MaskitoOptions } from "@maskito/core";

import type { InputMask } from "../input.types";
import { visibleToReact } from "./visible-to-react";

/**
 * Turns Maskito options into an `InputMask` over a string. Internal: the
 * fixed-pattern masks share it, and nothing outside `masks/` imports it.
 *
 * `format` runs the text through the same rules typing does. `parse` defaults
 * to that too, for a mask whose value keeps its separators, such as IPv4.
 */
export function maskitoMask(
  options: MaskitoOptions,
  {
    parse,
    inputMode,
  }: {
    parse?: (formatted: string) => string;
    inputMode?: InputMask<string>["inputMode"];
  } = {},
): InputMask<string> {
  const format = (value: string) => maskitoTransform(value, options);
  return {
    inputMode,
    attach(element) {
      const maskito = new Maskito(visibleToReact(element), options);
      return () => maskito.destroy();
    },
    format,
    parse: (masked) => (parse ? parse(format(masked)) : format(masked)),
  };
}
