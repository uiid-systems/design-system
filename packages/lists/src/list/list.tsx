import { Stack } from "@uiid/layout";

import { LIST_DEFAULT_MARKER } from "./list.constants";
import type { ListProps } from "./list.types";
import { ListItem, ListGroup, ListGroupHeader } from "./subcomponents";

import styles from "./list.module.css";

export const List = ({
  marker = LIST_DEFAULT_MARKER,
  category,
  icon,
  items,
  children,
  ItemProps,
  GroupProps,
  ...props
}: ListProps) => {
  const ListElement = marker === "decimal" ? <ol /> : <ul />;

  const list = (
    <Stack
      data-slot="list"
      data-marker={marker}
      ax="stretch"
      className={styles["list"]}
      render={ListElement}
      {...props}
    >
      {items
        ? items.map((item, index) =>
            "items" in item ? (
              <ListGroup
                key={item.category ?? index}
                {...item}
                {...GroupProps}
              />
            ) : (
              <ListItem key={index} fullwidth {...item} {...ItemProps} />
            ),
          )
        : children}
    </Stack>
  );

  if (!category) return list;

  return (
    <Stack data-slot="list-section" ax="stretch" fullwidth>
      <ListGroupHeader category={category} icon={icon} />
      {list}
    </Stack>
  );
};
List.displayName = "List";
