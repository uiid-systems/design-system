import { Menu as BaseMenu } from "@base-ui/react/menu";
import { resolveTrigger } from "@uiid/utils";

import type { MenuTriggerProps } from "../menu.types";

export const MenuTrigger = ({
  children,
  render,
  nativeButton,
  ...props
}: MenuTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BaseMenu.Trigger
      data-slot="menu-trigger"
      {...props}
      render={render ?? resolved.render}
      nativeButton={nativeButton ?? resolved.nativeButton}
    >
      {resolved.children}
    </BaseMenu.Trigger>
  );
};
MenuTrigger.displayName = "MenuTrigger";
