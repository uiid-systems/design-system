import { cx } from "@uiid/utils";

import { Card } from "../card/card";

import type { ActionCardProps } from "./action-card.types";
import styles from "./action-card.module.css";

export const ActionCard = ({
  title,
  className,
  children,
  ...props
}: ActionCardProps) => {
  return (
    <Card
      data-slot="action-card"
      render={<button role="button" />}
      className={cx(styles["action-card"], className)}
      title={title}
      {...props}
    >
      {children}
    </Card>
  );
};
ActionCard.displayName = "ActionCard";
