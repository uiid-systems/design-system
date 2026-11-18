import type { Combobox as BaseInputGroupTypes } from "@base-ui/react/combobox";
import { cxState } from "@uiid/utils";

import type { InputVariants } from "../../input/input.types";

type InputGroupRootProps = BaseInputGroupTypes.InputGroup.Props &
  Pick<InputVariants, "size">;

/**
 * Merges the monolith's `InputGroupProps` with the `InputGroupProps` nested in
 * its `InputProps`, since both reach the one group the Input part renders. The
 * nested value wins a conflict, as the rest of `InputProps` does, and the two
 * `className`s are joined rather than one replacing the other.
 */
export const mergeInputGroupProps = <T extends InputGroupRootProps>(
  outer: T | undefined,
  inner: T | undefined,
): T | undefined => {
  if (!outer || !inner) return inner ?? outer;
  return {
    ...outer,
    ...inner,
    className: cxState(outer.className, inner.className),
  };
};
