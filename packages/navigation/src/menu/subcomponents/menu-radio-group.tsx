import { Menu as BaseMenu } from "@base-ui/react/menu";

import type { MenuRadioGroupProps } from "../menu.types";

export const MenuRadioGroup = ({ children, ...props }: MenuRadioGroupProps) => {
  return (
    <BaseMenu.RadioGroup data-slot="menu-radio-group" {...props}>
      {children}
    </BaseMenu.RadioGroup>
  );
};
MenuRadioGroup.displayName = "MenuRadioGroup";
