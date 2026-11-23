import type { Menu as BaseMenu } from "@base-ui/react/menu";
import type { Icon } from "@uiid/icons";
import type { GroupProps } from "@uiid/layout";
import type {
  WithLayoutProps,
  WithStringClassName,
  WithTriggerChildren,
} from "@uiid/utils";

export type MenuItemType = {
  /** Drawn before the label. */
  icon?: Icon;
  label: string;
  value: string;
  /** Base UI's `disabled`: the item, or a submenu's trigger, ignores
   * interaction. */
  disabled?: boolean;
  /** Base UI's `onClick` for this item, called after `ItemProps.onClick`.
   * Ignored on an entry with `items`, whose trigger opens the submenu. */
  onClick?: MenuItemProps["onClick"];
  items?: MenuItemType[];
};

export type MenuRootProps = BaseMenu.Root.Props;
export type MenuTriggerProps = WithTriggerChildren<
  BaseMenu.Trigger.Props,
  BaseMenu.Trigger.State
>;
export type MenuPortalProps = BaseMenu.Portal.Props;
export type MenuBackdropProps = WithStringClassName<BaseMenu.Backdrop.Props>;
export type MenuPositionerProps =
  WithStringClassName<BaseMenu.Positioner.Props>;
export type MenuPopupProps = WithStringClassName<BaseMenu.Popup.Props>;
export type MenuItemProps = WithStringClassName<BaseMenu.Item.Props>;
export type SubmenuRootProps = BaseMenu.SubmenuRoot.Props;
export type SubmenuTriggerProps = WithLayoutProps<
  WithStringClassName<BaseMenu.SubmenuTrigger.Props>,
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
