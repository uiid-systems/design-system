import { Stack } from "@uiid/layout";

import type { ListProps } from "./list.types";
import { LIST_DEFAULT_MARKER } from "./list.constants";
import styles from "./list.module.css";
import { ListItem, ListGroup } from "./subcomponents";

export const List = ({
  marker = LIST_DEFAULT_MARKER,
  line,
  items,
  children,
  ItemProps,
  GroupProps,
  ...props
}: ListProps) => {
  const ListElement = marker === "decimal" ? <ol /> : <ul />;

  return (
    <Stack
      data-slot="list"
      data-marker={marker}
      data-line={line ? "true" : undefined}
      ax="stretch"
      p={0}
      m={0}
      className={styles["list"]}
      render={ListElement}
      {...props}
    >
      {items
        ? items.map((item, index) =>
            "items" in item ? (
              <ListGroup
                key={item.id ?? `${item.category ?? "group"}-${index}`}
                {...item}
                {...GroupProps}
              />
            ) : (
              <ListItem
                key={item.value}
                fullwidth
                {...item}
                {...ItemProps}
              />
            ),
          )
        : children}
    </Stack>
  );
};
List.displayName = "List";
