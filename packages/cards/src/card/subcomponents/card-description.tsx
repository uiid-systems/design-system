import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { CardDescriptionProps } from "../card.types";

import styles from "../card.module.css";

export const CardDescription = ({
  children,
  className,
  ...props
}: CardDescriptionProps) => {
  return (
    <Text
      data-slot="card-description"
      render={<p />}
      balance
      className={cx(styles["card-description"], className)}
      {...props}
    >
      {children}
    </Text>
  );
};
CardDescription.displayName = "CardDescription";
