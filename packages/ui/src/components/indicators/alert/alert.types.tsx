import type { BoxProps } from "@uiid/primitives";

import type { AlertIconProps } from "./subcomponents/alert-icon";

export type AlertProps = BoxProps & {
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: AlertIconProps["type"] | "inverted";
};
