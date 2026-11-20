import { SwitchRender, Stack, Group } from "@uiid/layout";

import type { AvatarContainerProps } from "../avatar.types";

export const AvatarContainer = ({
  orientation = "horizontal",
  render,
  children,
  ...props
}: AvatarContainerProps) => {
  return (
    <SwitchRender
      data-slot="avatar-container"
      {...props}
      condition={orientation === "horizontal"}
      render={{
        true: <Group gap={2} ay="center" render={render} />,
        false: <Stack ax="center" gap={4} render={render} />,
      }}
    >
      {children}
    </SwitchRender>
  );
};
