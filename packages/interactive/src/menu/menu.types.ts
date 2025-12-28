import type { Menu as BaseMenu } from "@base-ui/react/menu";

import type { Icon } from "@uiid/icons";

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
export type MenuTriggerProps = BaseMenu.Trigger.Props;
export type MenuPortalProps = BaseMenu.Portal.Props;
export type MenuPositionerProps = BaseMenu.Positioner.Props;
export type MenuPopupProps = BaseMenu.Popup.Props;
export type MenuItemProps = BaseMenu.Item.Props;
export type SubmenuRootProps = BaseMenu.SubmenuRoot.Props;
export type SubmenuTriggerProps = BaseMenu.SubmenuTrigger.Props;

export type MenuProps = {
  trigger: React.ReactNode;
  align?: MenuPositionerProps["align"];
  side?: MenuPositionerProps["side"];
  items: MenuItemType[];
  RootProps?: MenuRootProps;
  TriggerProps?: MenuTriggerProps;
  PopupProps?: MenuPopupProps;
  PositionerProps?: MenuPositionerProps;
  ItemProps?: MenuItemProps;
  SubmenuRootProps?: SubmenuRootProps;
  SubmenuTriggerProps?: SubmenuTriggerProps;
};
