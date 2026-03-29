import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { BadgeProps } from "./badge.types";
import { badgeVariants } from "./badge.variants";
import styles from "./badge.module.css";

export const Badge = ({
  size,
  color,
  className,
  children,
  ...props
}: BadgeProps) => {
  return (
    <Group
      data-slot="badge"
      className={cx(
        styles["badge"],
        badgeVariants({ size, color }),
        className,
      )}
      ay="center"
      gap={1}
      {...props}
    >
      <Text
        data-slot="badge-text"
        className={styles["badge-text"]}
        size={-1}
        weight="bold"
      >
        {children}
      </Text>
    </Group>
  );
};
Badge.displayName = "Badge";
