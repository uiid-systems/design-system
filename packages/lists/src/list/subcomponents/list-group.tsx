import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type {
  ListGroupProps,
  ListGroupRootProps,
  ListItemOrGroup,
  ListItemProps,
} from "../list.types";
import { ListGroupHeader } from "./list-group-header";
import { ListItem } from "./list-item";

import styles from "../list.module.css";

/**
 * Shallow-merge inherited defaults with an entry's own: the entry's values win
 * and the two `className`s join.
 */
const mergeDefaults = <T extends { className?: string }>(
  inherited?: T,
  own?: T,
): T | undefined =>
  inherited && own
    ? {
        ...inherited,
        ...own,
        className: cx(inherited.className, own.className),
      }
    : (own ?? inherited);

/**
 * @internal Not exported from the package; `List` and `ListGroup` share it.
 *
 * Renders `items` entries as `ListItem`s and nested `ListGroup`s. The shared
 * `ItemProps` and `GroupProps` are defaults: they pass down to every level, and
 * an entry's own props win. Used by both `List` and `ListGroup` so top-level and
 * grouped items render the same.
 */
export const ListEntries = ({
  items,
  ItemProps,
  GroupProps,
}: {
  items: ListItemOrGroup[];
  ItemProps?: Partial<ListItemProps>;
  GroupProps?: ListGroupRootProps;
}) =>
  items.map((item, index) =>
    "items" in item ? (
      <ListGroup
        key={`group-${item.category ?? index}`}
        {...item}
        ItemProps={mergeDefaults(ItemProps, item.ItemProps)}
        GroupProps={mergeDefaults(GroupProps, item.GroupProps)}
      />
    ) : (
      <ListItem
        key={index}
        fullwidth
        {...ItemProps}
        {...item}
        className={cx(ItemProps?.className, item.className)}
      />
    ),
  );

export const ListGroup = ({
  category,
  icon,
  items,
  ItemProps,
  GroupProps,
}: ListGroupProps) => {
  return (
    <Stack
      data-slot="list-group"
      render={<li />}
      fullwidth
      {...GroupProps}
      className={cx(styles["list-group"], GroupProps?.className)}
    >
      <ListGroupHeader category={category} icon={icon} />

      <ul data-slot="list-group-panel" className={styles["list-group-panel"]}>
        <ListEntries
          items={items}
          ItemProps={ItemProps}
          GroupProps={GroupProps}
        />
      </ul>
    </Stack>
  );
};
ListGroup.displayName = "ListGroup";
