import type { MenuItemType, MenuProps } from "./menu.types";
import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  SubmenuRoot,
  SubmenuTrigger,
} from "./subcomponents";

/** The slot props that reach the rows of every popup, at every depth. */
export type MenuItemSlots = Pick<
  MenuProps,
  | "ItemProps"
  | "SubmenuRootProps"
  | "SubmenuTriggerProps"
  | "PortalProps"
  | "SubmenuPositionerProps"
  | "SubmenuPopupProps"
>;

/*
 * Draws one popup's entries: the root popup's and, by calling itself, every
 * submenu's. An entry with `items` becomes a submenu, at any depth.
 *
 * Each entry's `label` and `icon` are its row's content. They are set after
 * the slot spread, and `description` and `children` are cleared, so an
 * untyped slot cannot replace them or give every row one shared line. An
 * entry's `disabled` wins over the slot's, and its `onClick` runs after
 * `ItemProps.onClick`. Rows are keyed by `value`, so it must be unique among
 * siblings.
 *
 * Internal: not exported from the package.
 */
export const renderMenuItems = (
  items: MenuItemType[],
  slots: MenuItemSlots,
): React.ReactNode => {
  const { ItemProps, SubmenuRootProps, SubmenuTriggerProps } = slots;

  return items.map((item) => {
    if (item.items) {
      return (
        <SubmenuRoot key={item.value} {...SubmenuRootProps}>
          <SubmenuTrigger
            {...SubmenuTriggerProps}
            label={item.label}
            icon={item.icon}
            description={undefined}
            children={undefined}
            disabled={item.disabled ?? SubmenuTriggerProps?.disabled}
          />
          <MenuPortal {...slots.PortalProps}>
            <MenuPositioner {...slots.SubmenuPositionerProps}>
              <MenuPopup {...slots.SubmenuPopupProps}>
                {renderMenuItems(item.items, slots)}
              </MenuPopup>
            </MenuPositioner>
          </MenuPortal>
        </SubmenuRoot>
      );
    }

    return (
      <MenuItem
        key={item.value}
        {...ItemProps}
        label={item.label}
        icon={item.icon}
        description={undefined}
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
