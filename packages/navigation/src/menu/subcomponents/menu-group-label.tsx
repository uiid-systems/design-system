import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Text } from "@uiid/typography";

import type { MenuGroupLabelProps } from "../menu.types";

/**
 * Painted like Select's group label: `Text` at step -1, medium weight, with no
 * `shade`, so it inherits the popup Card's `--palette-on-tint` and tracks its
 * hue. Menu rebuilds that treatment rather than importing it: it lives in
 * `@uiid/forms`, which `@uiid/navigation` does not depend on.
 */
export const MenuGroupLabel = ({ children, ...props }: MenuGroupLabelProps) => {
  return (
    <BaseMenu.GroupLabel
      data-slot="menu-group-label"
      render={<Text size={-1} weight="medium" />}
      {...props}
    >
      {children}
    </BaseMenu.GroupLabel>
  );
};
MenuGroupLabel.displayName = "MenuGroupLabel";
