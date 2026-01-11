import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AvatarInitialsProps } from "../avatar.types";
import { TITLE_SIZE_VARIANTS } from "../avatar.variants";
import styles from "../avatar.module.css";

export const AvatarInitials = ({
  initials,
  size,
  className,
  ...props
}: AvatarInitialsProps) => {
  return (
    <Text
      data-slot="avatar-initials"
      className={cx(styles["avatar-initials"], className)}
      size={TITLE_SIZE_VARIANTS[size!]}
      {...props}
    >
      {initials}
    </Text>
  );
};
AvatarInitials.displayName = "AvatarInitials";
