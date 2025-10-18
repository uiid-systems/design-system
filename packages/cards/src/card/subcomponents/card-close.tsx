import { CloseButton } from "@uiid/buttons";

import type { CardProps } from "../card.types";

import styles from "./card-close.module.css";

export type CardCloseProps = Pick<CardProps, "onClose">;

export const CardClose = ({ onClose }: CardCloseProps) => {
  return (
    <CloseButton
      variant="inverted"
      fill="outline"
      onClick={onClose}
      className={styles["card-close"]}
    />
  );
};
CardClose.displayName = "CardClose";
