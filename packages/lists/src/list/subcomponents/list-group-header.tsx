import type { Icon } from "@uiid/icons";
import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";

import { ICON_SIZE_LARGE } from "../list.constants";

import styles from "../list.module.css";

export type ListGroupHeaderProps = {
  category?: string;
  icon?: Icon;
};

export const ListGroupHeader = ({
  category,
  icon: Icon,
}: ListGroupHeaderProps) => {
  if (!category) return null;

  return (
    <Group
      data-slot="list-group-header"
      className={styles["list-group-header"]}
      ay="center"
      ax="start"
      gap={2}
      py={1}
      fullwidth
    >
      {Icon && (
        <Icon className={styles["list-group-icon"]} size={ICON_SIZE_LARGE} />
      )}
      <Text
        data-slot="list-group-category"
        render={<h3 />}
        className={styles["list-group-category"]}
        weight="bold"
        size={0}
      >
        {category}
      </Text>
    </Group>
  );
};
ListGroupHeader.displayName = "ListGroupHeader";
