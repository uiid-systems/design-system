import type { Toggle } from "@base-ui/react/toggle";

import type { ButtonProps } from "../button/button.types";

export type ToggleButtonProps = Toggle.Props &
  ButtonProps & {
    icon?: {
      pressed: React.ReactNode;
      unpressed: React.ReactNode;
    };
    text?: {
      pressed: string;
      unpressed: string;
    };
  };
