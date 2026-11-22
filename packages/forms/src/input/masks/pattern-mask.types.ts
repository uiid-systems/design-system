import type { InputMask } from "../input.types";

export type PatternMaskOptions = {
  /**
   * More slot characters beside `#`, each with the one-character pattern it
   * takes, such as `{ A: /[A-Z]/ }`. A slot character is never a literal.
   */
  slots?: Record<string, RegExp>;
  /** Uppercases typed and pasted text before the slots test it. */
  uppercase?: boolean;
  /**
   * The virtual keyboard to ask for. Defaults to `"numeric"` when the template
   * has only `#` slots, and to none once `slots` names any, since it cannot
   * tell what a slot's pattern takes.
   */
  inputMode?: InputMask<string>["inputMode"];
};
