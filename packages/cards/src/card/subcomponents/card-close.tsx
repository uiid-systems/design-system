import { CloseButton, type CloseButtonProps } from "@uiid/buttons";

import type { CardProps } from "../card.types";

export type CardCloseProps = Pick<CardProps, "onDismiss"> & CloseButtonProps;

export const CardClose = ({ onDismiss, ...props }: CardCloseProps) => {
  return (
    <CloseButton
      data-slot="card-close"
      variant="inverted"
      fill="outline"
      onClick={onDismiss}
      {...props}
    />
  );
};
CardClose.displayName = "CardClose";
