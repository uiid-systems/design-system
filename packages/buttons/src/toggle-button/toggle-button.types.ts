import type { Toggle } from "@base-ui/react/toggle";

import type { ButtonProps } from "../button/button.types";

/*
 * Toggle renders its own Button, so `render` and `nativeButton` never reach
 * the element, and Base UI's Toggle discards `type` — it is always a
 * `type="button"`. They are left out so passing one is a type error rather
 * than silently ignored.
 */
type ToggleOwnedProps = "render" | "nativeButton" | "type";

export type ToggleButtonProps = Omit<Toggle.Props, ToggleOwnedProps> &
  Omit<ButtonProps, ToggleOwnedProps> & {
    icon?: {
      pressed: React.ReactNode;
      unpressed: React.ReactNode;
    };
    text?: {
      pressed: string;
      unpressed: string;
    };
  };
