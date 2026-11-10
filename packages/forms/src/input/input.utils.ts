import { isRenderable } from "@uiid/utils";

import type { InputWrapperProps } from "./input.types";

/**
 * Whether an `InputWrapper` with these slots paints the surface itself. The
 * control it wraps reads the same answer to decide whether to drop its own
 * surface (`inner`), so the two never disagree about which element wears it.
 */
export const hasInputSlots = ({
  before,
  after,
}: Pick<InputWrapperProps, "before" | "after">) =>
  isRenderable(before) || isRenderable(after);
