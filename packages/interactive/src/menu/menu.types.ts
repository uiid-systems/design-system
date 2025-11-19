import type { Menu } from "@base-ui-components/react/menu";

import type { Icon } from "@uiid/icons";

export type MenuItem = {
  icon?: Icon;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
  selected?: boolean;
  items?: MenuItem[];
};

export type MenuProps = {
  trigger: React.ReactNode;
  align?: Menu.Positioner.Props["align"];
  side?: Menu.Positioner.Props["side"];
  items: MenuItem[];
  RootProps?: Menu.Root.Props;
  TriggerProps?: Menu.Trigger.Props;
  PopupProps?: Omit<Menu.Popup.Props, "children">;
  PositionerProps?: Menu.Positioner.Props;
  ItemProps?: Menu.Item.Props;
  SubmenuRootProps?: Menu.SubmenuRoot.Props;
  SubmenuTriggerProps?: Menu.SubmenuTrigger.Props;
};
