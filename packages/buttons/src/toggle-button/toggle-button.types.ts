import type { Toggle } from "@base-ui-components/react/toggle";

import type { ButtonProps } from "../button/button.types";

export type ToggleButtonProps = Toggle.Props &
  Pick<ButtonProps, "variant" | "tooltip" | "size" | "square"> & {
    icon?: {
      pressed: React.ReactNode;
      unpressed: React.ReactNode;
    };
    text?: {
      pressed: string;
      unpressed: string;
    };
  };
