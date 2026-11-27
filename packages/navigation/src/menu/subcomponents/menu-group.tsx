import { Menu as BaseMenu } from "@base-ui/react/menu";

import type { MenuGroupProps } from "../menu.types";

export const MenuGroup = ({ children, ...props }: MenuGroupProps) => {
  return (
    <BaseMenu.Group data-slot="menu-group" {...props}>
      {children}
    </BaseMenu.Group>
  );
};
MenuGroup.displayName = "MenuGroup";
