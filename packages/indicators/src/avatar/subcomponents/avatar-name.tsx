import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AvatarNameProps } from "../avatar.types";
import styles from "../avatar.module.css";

export const AvatarName = ({ name, className, ...props }: AvatarNameProps) => {
  return (
    <Text
      data-slot="avatar-name"
      className={cx(styles["avatar-name"], className)}
      size={0}
      {...props}
    >
      {name}
    </Text>
  );
};
AvatarName.displayName = "AvatarName";
