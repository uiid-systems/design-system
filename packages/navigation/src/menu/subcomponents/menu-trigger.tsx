import { Menu as BaseMenu } from "@base-ui/react/menu";
import { resolveTrigger } from "@uiid/utils";

import type { MenuTriggerProps } from "../menu.types";

export const MenuTrigger = ({ children, ...props }: MenuTriggerProps) => (
  <BaseMenu.Trigger
    data-slot="menu-trigger"
    {...resolveTrigger(children, props.render)}
    {...props}
  />
);
MenuTrigger.displayName = "MenuTrigger";
