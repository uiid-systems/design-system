import type { Toggle } from "@base-ui-components/react/toggle";

import type { ButtonProps } from "../button/button.types";

export type ToggleButtonProps = Toggle.Props &
  Pick<ButtonProps, "icon" | "iconPosition" | "variant" | "tooltip"> & {
    pressedIcon?: ButtonProps["icon"];
    pressedText?: string;
  };
