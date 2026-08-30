import { Menu as BaseMenu } from "@base-ui/react/menu";

import type { MenuRootProps } from "../menu.types";

export const MenuRoot = ({ children, ...props }: MenuRootProps) => {
  return <BaseMenu.Root {...props}>{children}</BaseMenu.Root>;
};
MenuRoot.displayName = "MenuRoot";
