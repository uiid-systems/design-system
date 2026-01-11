import { SwitchRender, Stack, Group } from "@uiid/layout";

import type { AvatarContainerProps } from "../avatar.types";

export const AvatarContainer = ({
  orientation = "horizontal",
  className,
  children,
  ...props
}: AvatarContainerProps) => {
  return (
    <SwitchRender
      data-slot="avatar-container"
      className={className}
      {...props}
      condition={orientation === "horizontal"}
      render={{
        true: <Group gap={2} ay="center" />,
        false: <Stack ax="center" gap={4} />,
      }}
    >
      {children}
    </SwitchRender>
  );
};
