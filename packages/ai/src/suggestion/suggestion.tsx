import { Button } from "@uiid/buttons";

import type { SuggestionProps } from "./suggestion.types";

/**
 * A canned prompt the reader can send with one press. `onClick` is the
 * native handler; close over the text in the caller's `map`.
 */
export const Suggestion = ({
  variant = "subtle",
  shape = "pill",
  size = "small",
  type = "button",
  ...props
}: SuggestionProps) => (
  <Button
    data-slot="suggestion"
    variant={variant}
    shape={shape}
    size={size}
    type={type}
    {...props}
  />
);
Suggestion.displayName = "Suggestion";
