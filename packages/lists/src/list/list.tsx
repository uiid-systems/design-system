import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { LIST_DEFAULT_MARKER } from "./list.constants";
import type { ListProps } from "./list.types";
import { ListGroupHeader, ListEntries } from "./subcomponents";
import { ListMarkerProvider } from "./subcomponents/list-marker-provider";

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

  if (!category) {
    return <ListMarkerProvider marker={marker}>{list}</ListMarkerProvider>;
  }

  return (
    <Stack data-slot="list-section" w="full">
      <ListGroupHeader category={category} icon={icon} />
      <ListMarkerProvider marker={marker}>{list}</ListMarkerProvider>
    </Stack>
  );
};
List.displayName = "List";
