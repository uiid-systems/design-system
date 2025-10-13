import type { CardProps } from "@uiid/primitives";

export type AlertProps = CardProps & {
  dismissible?: boolean;
  onDismiss?: () => void;
};
