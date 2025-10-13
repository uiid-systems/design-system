import { cx } from "../../../utils";
import { Stack } from "../stack/stack";

import type { CardProps } from "./card.types";
import styles from "./card.module.css";

export const Card = ({ className, ...props }: CardProps) => {
  return (
    <Stack
      uiid="card"
      ax="start"
      className={cx(styles.card, className)}
      {...props}
    />
  );
};
Card.displayName = "Card";
