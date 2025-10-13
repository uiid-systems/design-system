import { cx } from "../../../utils";
import { Stack } from "../stack/stack";

import type { CardProps } from "./card.types";
import styles from "./card.module.css";

export const Card = ({ size = "md", className, ...props }: CardProps) => {
  return (
    <Stack
      uiid="card"
      ax="start"
      data-size={size}
      className={cx(styles.card, className)}
      {...props}
    />
  );
};
Card.displayName = "Card";
