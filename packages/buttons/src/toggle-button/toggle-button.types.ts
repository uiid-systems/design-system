import type { Toggle } from "@base-ui-components/react/toggle";

import type { ButtonProps } from "../button/button.types";

export type ToggleButtonProps = Toggle.Props &
  Pick<ButtonProps, "iconPosition" | "variant" | "tooltip"> & {
    icon?: {
      pressed: ButtonProps["icon"];
      unpressed: ButtonProps["icon"];
    };
    text?: {
      pressed: string;
      unpressed: string;
    };
  };
