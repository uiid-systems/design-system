import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { BadgeProps } from "./badge.types";
import styles from "./badge.module.css";

export const Badge = ({
  variant,
  hideIndicator,
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <Group
      data-slot="badge"
      ay="center"
      gap={1}
      data-variant={variant}
      className={cx(styles["badge"], className)}
      style={{ display: "inline-flex" }}
      {...props}
    >
      {!hideIndicator && (
        <span
          data-slot="badge-indicator"
          className={styles["badge-indicator"]}
        />
      )}
      <Text
        data-slot="badge-text"
        level={-1}
        bold
        className={styles["badge-text"]}
      >
        {children}
      </Text>
    </Group>
  );
};
Badge.displayName = "Badge";
