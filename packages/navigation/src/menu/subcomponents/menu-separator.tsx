import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Separator } from "@uiid/layout";

import type { MenuSeparatorProps } from "../menu.types";

/*
 * A line between sets of rows: Base UI's menu `Separator`, drawn by the layout
 * `Separator` with Select's spacing. `orientation` reaches both, so the line
 * and its `aria-orientation` agree.
 *
 * Select cannot render the layout `Separator`: a listbox separator carries
 * `role="presentation"`, which forbids the `aria-orientation` Base UI adds. A
 * menu separator keeps `role="separator"`, where that attribute is allowed.
 */
export const MenuSeparator = ({
  orientation,
  ...props
}: MenuSeparatorProps) => {
  return (
    <BaseMenu.Separator
      data-slot="menu-separator"
      orientation={orientation}
      render={<Separator orientation={orientation} my={1} />}
      {...props}
    />
  );
};
MenuSeparator.displayName = "MenuSeparator";
