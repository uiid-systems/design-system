import { Menu as BaseMenu } from "@base-ui/react/menu";

import type { MenuPortalProps } from "../menu.types";

export const MenuPortal = ({ children, ...props }: MenuPortalProps) => {
  return (
    <BaseMenu.Portal data-slot="menu-portal" {...props}>
      {children}
    </BaseMenu.Portal>
  );
};
MenuPortal.displayName = "MenuPortal";
