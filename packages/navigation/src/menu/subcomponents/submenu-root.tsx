import { Menu as BaseMenu } from "@base-ui/react/menu";

import type { SubmenuRootProps } from "../menu.types";

export const SubmenuRoot = ({ children, ...props }: SubmenuRootProps) => {
  return (
    <BaseMenu.SubmenuRoot data-slot="submenu-root" {...props}>
      {children}
    </BaseMenu.SubmenuRoot>
  );
};

SubmenuRoot.displayName = "SubmenuRoot";
