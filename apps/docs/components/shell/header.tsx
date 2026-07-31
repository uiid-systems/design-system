import { Group, type GroupProps } from "@uiid/design-system";

import { SHELL_SPACING, SHELL_BORDER_WIDTH } from "./constants";

export const HeaderContainer = ({ children, ...props }: GroupProps) => {
  return (
    <Group
      data-slot="header-container"
      render={<header style={{ zIndex: 2 }} />}
      className="sticky top-0 bg-(--shade-background)"
      ay="center"
      ax="space-between"
      gap={SHELL_SPACING}
      p={SHELL_SPACING}
      bb={SHELL_BORDER_WIDTH}
      fullwidth
      {...props}
    >
      {children}
    </Group>
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
