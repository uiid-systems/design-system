import { CloseButton } from "@uiid/buttons";

import type { CardProps } from "../card.types";

import styles from "./card-close.module.css";

export type CardCloseProps = Pick<CardProps, "onDismiss">;

export const CardClose = ({ onDismiss }: CardCloseProps) => {
  return (
    <CloseButton
      variant="inverted"
      fill="outline"
      onClick={onDismiss}
      className={styles["card-close"]}
    />
  );
};
CardClose.displayName = "CardClose";
