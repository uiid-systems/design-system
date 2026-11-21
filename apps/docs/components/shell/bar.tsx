import { Group, type GroupProps } from "@uiid/design-system";

import {
  SHELL_BAR_HEIGHT,
  SHELL_BORDER_WIDTH,
  SHELL_SPACING,
} from "./constants";

/**
 * The strip across the top of a shell column. The sidebar's title and the
 * page header both render through it, so their heights and bottom borders
 * always line up.
 */
export const ShellBar = ({ children, ...props }: GroupProps) => {
  return (
    <Group
      data-slot="shell-bar"
      className="shrink-0"
      ay="center"
      gap={SHELL_SPACING}
      px={SHELL_SPACING}
      h={SHELL_BAR_HEIGHT}
      bb={SHELL_BORDER_WIDTH}
      w="full"
      {...props}
    >
      {children}
    </Group>
  );
};
ShellBar.displayName = "ShellBar";
