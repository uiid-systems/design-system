import { Text } from "@uiid/typography";

import { cx } from "@uiid/utils";

import type { AvatarDescriptionProps } from "../avatar.types";
import styles from "../avatar.module.css";

export const AvatarDescription = ({
  description,
  className,
  ...props
}: AvatarDescriptionProps) => {
  return (
    <Text
      data-slot="avatar-description"
      className={cx(styles["avatar-description"], className)}
      size={0}
      {...props}
    >
      {description}
    </Text>
  );
};
AvatarDescription.displayName = "AvatarDescription";
