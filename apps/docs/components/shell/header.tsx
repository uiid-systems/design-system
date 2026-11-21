import { Group, type GroupProps } from "@uiid/design-system";

import { ShellBar } from "./bar";
import { SHELL_SPACING } from "./constants";

export const HeaderContainer = ({ children, ...props }: GroupProps) => {
  return (
    <ShellBar
      data-slot="header-container"
      render={<header />}
      ax="space-between"
      {...props}
    >
      {children}
    </ShellBar>
  );
};
HeaderContainer.displayName = "HeaderContainer";

export const HeaderGroup = ({ children, ...props }: GroupProps) => {
  return (
    <Group data-slot="header-group" gap={SHELL_SPACING / 2} {...props}>
      {children}
    </Group>
  );
};
HeaderGroup.displayName = "HeaderGroup";
