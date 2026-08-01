import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AvatarInitialsProps } from "../avatar.types";

import styles from "../avatar.module.css";

export const AvatarInitials = ({
  initials,
  className,
  ...props
}: AvatarInitialsProps) => {
  return (
    <Text
      data-slot="avatar-initials"
      className={cx(styles["avatar-initials"], className)}
      size={1}
      {...props}
    >
      {initials}
    </Text>
  );
};
AvatarInitials.displayName = "AvatarInitials";
