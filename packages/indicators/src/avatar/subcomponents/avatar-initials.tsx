import { Text } from "@uiid/typography";

import type { AvatarInitialsProps } from "../avatar.types";
import styles from "../avatar.module.css";

export const AvatarInitials = ({ initials, ...props }: AvatarInitialsProps) => {
  return (
    <Text
      data-slot="avatar-initials"
      className={styles["avatar-initials"]}
      size={0}
      {...props}
    >
      {initials}
    </Text>
  );
};
AvatarInitials.displayName = "AvatarInitials";
