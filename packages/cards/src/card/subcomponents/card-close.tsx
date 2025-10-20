import { CloseButton } from "@uiid/buttons";

import type { CardProps } from "../card.types";

export type CardCloseProps = Pick<CardProps, "onDismiss">;

export const CardClose = ({ onDismiss }: CardCloseProps) => {
  return (
    <CloseButton
      data-slot="card-close"
      variant="inverted"
      fill="outline"
      onClick={onDismiss}
    />
  );
};
CardClose.displayName = "CardClose";
