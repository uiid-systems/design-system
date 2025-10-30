import { CloseButton, type CloseButtonProps } from "@uiid/buttons";

import type { CardProps } from "../card.types";

export type CardCloseProps = Pick<CardProps, "onDismiss"> & CloseButtonProps;

export const CardClose = ({ onDismiss, ...props }: CardCloseProps) => {
  return <CloseButton data-slot="card-close" onClick={onDismiss} {...props} />;
};
CardClose.displayName = "CardClose";
