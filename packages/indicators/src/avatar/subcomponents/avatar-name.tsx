import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AvatarNameProps } from "../avatar.types";
import styles from "../avatar.module.css";
import { TITLE_SIZE_VARIANTS } from "../avatar.variants";

export const AvatarName = ({
  name,
  size,
  className,
  ...props
}: AvatarNameProps) => {
  return (
    <Text
      data-slot="avatar-name"
      className={cx(styles["avatar-name"], className)}
      size={TITLE_SIZE_VARIANTS[size!]}
      weight="bold"
      {...props}
    >
      {name}
    </Text>
  );
};
AvatarName.displayName = "AvatarName";
