import type { MenuItemType, MenuProps } from "./menu.types";
import {
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  SubmenuRoot,
  SubmenuTrigger,
} from "./subcomponents";

/** The slot props that reach the rows of every popup, at every depth. */
export type MenuItemSlots = Pick<
  MenuProps,
  "ItemProps" | "SubmenuRootProps" | "SubmenuTriggerProps" | "LinkItemProps"
>;

/*
 * Draws one popup's entries: the root popup's and, by calling itself, every
 * submenu's. An entry with `items` becomes a submenu, and an entry with
 * `href` a link, at any depth.
 *
 * Each entry's `label`, `icon`, `description` and `href` are its row's own.
 * They are set after the slot spread, and `children` is cleared, so an
 * untyped slot cannot replace them or give every row one shared line. An
 * entry's `disabled` wins over the slot's, and its `onClick` runs after
 * `ItemProps.onClick` or `LinkItemProps.onClick`. Rows are keyed by `value`,
 * so it must be unique among siblings.
 *
 * A link entry closes the menu when clicked, as an action row does, so a
 * router or hash link does not leave the modal menu open over the new view.
 * Set before the slot spread, so `LinkItemProps.closeOnClick` can opt out.
 *
 * Internal: not exported from the package.
 */
export const renderMenuItems = (
  items: MenuItemType[],
  slots: MenuItemSlots,
): React.ReactNode => {
  const { ItemProps, SubmenuRootProps, SubmenuTriggerProps, LinkItemProps } =
    slots;

  return items.map((item) => {
    if (item.items) {
      return (
        <SubmenuRoot key={item.value} {...SubmenuRootProps}>
          <SubmenuTrigger
            {...SubmenuTriggerProps}
            label={item.label}
            icon={item.icon}
            description={item.description}
            children={undefined}
            disabled={item.disabled ?? SubmenuTriggerProps?.disabled}
          />
          <MenuPortal>
            <MenuPositioner>
              <MenuPopup>{renderMenuItems(item.items, slots)}</MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </SubmenuRoot>
      );
    }

    if (item.href !== undefined) {
      return (
        <MenuLinkItem
          key={item.value}
          closeOnClick
          {...LinkItemProps}
          href={item.href}
          label={item.label}
          icon={item.icon}
          description={item.description}
          children={undefined}
          onClick={(event) => {
            LinkItemProps?.onClick?.(event);
            item.onClick?.(event);
          }}
        />
      );
    }

    return (
      <MenuItem
        key={item.value}
        {...ItemProps}
        label={item.label}
        icon={item.icon}
        description={item.description}
        children={undefined}
        disabled={item.disabled ?? ItemProps?.disabled}
        onClick={(event) => {
          ItemProps?.onClick?.(event);
          item.onClick?.(event);
        }}
      />
    );
  });
};
