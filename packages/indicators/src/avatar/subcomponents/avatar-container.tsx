import { SwitchRender, Stack, Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AvatarContainerProps } from "../avatar.types";
import styles from "../avatar.module.css";

export const AvatarContainer = ({
  orientation = "horizontal",
  render,
  className,
  children,
  ...props
}: AvatarContainerProps) => {
  return (
    <SwitchRender
      data-slot="avatar-container"
      className={cx(styles["avatar-container"], className)}
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
