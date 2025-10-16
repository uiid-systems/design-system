import type { CardProps } from "@uiid/layout";

export type AlertProps = CardProps & {
  dismissible?: boolean;
  onDismiss?: () => void;
};
