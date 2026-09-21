import type { Menu as BaseMenu } from "@base-ui/react/menu";
import type { Icon } from "@uiid/icons";
import type { GroupProps } from "@uiid/layout";
import type { WithLayoutProps, WithTriggerChildren } from "@uiid/utils";

export type MenuItemType = {
  icon?: Icon;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  selected?: boolean;
  items?: MenuItemType[];
};

export type MenuRootProps = BaseMenu.Root.Props;
export type MenuTriggerProps = WithTriggerChildren<
  BaseMenu.Trigger.Props,
  BaseMenu.Trigger.State
>;
export type MenuPortalProps = BaseMenu.Portal.Props;
export type MenuBackdropProps = BaseMenu.Backdrop.Props;
export type MenuPositionerProps = BaseMenu.Positioner.Props;
export type MenuPopupProps = BaseMenu.Popup.Props;
export type MenuItemProps = BaseMenu.Item.Props;
export type SubmenuRootProps = BaseMenu.SubmenuRoot.Props;
export type SubmenuTriggerProps = WithLayoutProps<
  BaseMenu.SubmenuTrigger.Props,
  GroupProps
>;

export type MenuProps = {
  trigger: MenuTriggerProps["children"];
  items: MenuItemType[];
  /**
   * Dims the page behind the open popup, the way a dialog or drawer does, so an
   * open menu is never lost against the content around it.
   *
   * Visual only: Base UI's Root is already `modal` by default, so page scroll
   * is locked and outside pointers are blocked whether or not this is drawn.
   * Only the root menu draws one — a submenu opening over its parent must not
   * darken the page a second time.
   * @default true
   */
  backdrop?: boolean;
  RootProps?: MenuRootProps;
  TriggerProps?: MenuTriggerProps;
  BackdropProps?: MenuBackdropProps;
  PopupProps?: MenuPopupProps;
  PositionerProps?: MenuPositionerProps;
  ItemProps?: MenuItemProps;
  SubmenuRootProps?: SubmenuRootProps;
  SubmenuTriggerProps?: SubmenuTriggerProps;
} & Pick<MenuPositionerProps, "side" | "align">;
