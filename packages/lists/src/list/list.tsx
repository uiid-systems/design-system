import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { LIST_DEFAULT_MARKER } from "./list.constants";
import type { ListProps } from "./list.types";
import { ListGroupHeader, ListEntries } from "./subcomponents";

import styles from "./list.module.css";

export const List = ({
  marker = LIST_DEFAULT_MARKER,
  category,
  icon,
  items,
  children,
  ItemProps,
  GroupProps,
  className,
  ...props
}: ListProps) => {
  const ListElement = marker === "decimal" ? <ol /> : <ul />;

  const list = (
    <Stack
      data-slot="list"
      data-marker={marker}
      className={cx(styles["list"], className)}
      render={ListElement}
      {...props}
    >
      {items ? (
        <ListEntries
          items={items}
          ItemProps={ItemProps}
          GroupProps={GroupProps}
        />
      ) : (
        children
      )}
    </Stack>
  );

  if (!category) return list;

  return (
    <Stack data-slot="list-section" fullwidth>
      <ListGroupHeader category={category} icon={icon} />
      {list}
    </Stack>
  );
};
List.displayName = "List";
