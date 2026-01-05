import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CardActionProps } from "../card.types";
import styles from "../card.module.css";

export const CardAction = ({
  children,
  className,
  ...props
}: CardActionProps) => {
  return (
    <Group
      data-slot="card-action"
      className={cx(styles["card-action"], className)}
      gap={2}
      {...props}
    >
      {children}
    </Group>
  );
};
CardAction.displayName = "CardAction";
