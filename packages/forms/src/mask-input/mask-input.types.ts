import type { InputMask, InputProps } from "../input/input.types";

export type MaskInputProps = Omit<InputProps, "mask"> & {
  /**
   * Formats the text as it is typed: an imported mask such as `phoneMask`, or
   * one built with `patternMask`, `currencyMask`, `percentMask` or
   * `numberMask`. Create it at module scope or memoize it: a new mask on every
   * render is detached and attached on every render.
   */
  mask: InputMask<unknown>;
};
