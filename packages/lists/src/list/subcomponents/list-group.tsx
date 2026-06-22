import { Text } from "@uiid/typography";
import { Group, Stack } from "@uiid/layout";

import type { ListGroupProps } from "../list.types";

import { ListItem } from "./list-item";
import { ICON_SIZE_LARGE } from "../list.constants";
import styles from "../list.module.css";

export const ListGroup = ({ category, icon: Icon, items }: ListGroupProps) => {
  return (
    <Stack
      data-slot="list-group"
      render={<li />}
      ax="stretch"
      fullwidth
      className={styles["list-group"]}
    >
      {category && (
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
            <Icon
              className={styles["list-group-icon"]}
              size={ICON_SIZE_LARGE}
            />
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
      )}

      <ul data-slot="list-group-panel" className={styles["list-group-panel"]}>
        {items.map((item, index) =>
          "items" in item ? (
            <ListGroup
              key={item.id ?? item.category ?? index}
              {...item}
            />
          ) : (
            <ListItem key={index} {...item} />
          ),
        )}
      </ul>
    </Stack>
  );
};
ListGroup.displayName = "ListGroup";
