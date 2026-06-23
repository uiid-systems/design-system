import { Stack } from "@uiid/layout";

import type { ListGroupProps } from "../list.types";

import { ListItem } from "./list-item";
import { ListGroupHeader } from "./list-group-header";
import styles from "../list.module.css";

export const ListGroup = ({ category, icon, items }: ListGroupProps) => {
  return (
    <Stack
      data-slot="list-group"
      render={<li />}
      ax="stretch"
      fullwidth
      className={styles["list-group"]}
    >
      <ListGroupHeader category={category} icon={icon} />

      <ul data-slot="list-group-panel" className={styles["list-group-panel"]}>
        {items.map((item, index) =>
          "items" in item ? (
            <ListGroup key={item.category ?? index} {...item} />
          ) : (
            <ListItem key={index} {...item} />
          ),
        )}
      </ul>
    </Stack>
  );
};
ListGroup.displayName = "ListGroup";
