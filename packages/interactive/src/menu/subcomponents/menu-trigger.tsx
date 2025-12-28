import { Menu as BaseMenu } from "@base-ui/react/menu";
import { isValidElement } from "react";

import type { MenuTriggerProps } from "../menu.types";

export const MenuTrigger = ({ children, ...props }: MenuTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseMenu.Trigger
      data-slot="menu-trigger"
      render={<div tabIndex={triggerIsEl ? -1 : 0} />}
      nativeButton={false}
      {...props}
    >
      {children}
    </BaseMenu.Trigger>
  );
};
MenuTrigger.displayName = "MenuTrigger";
