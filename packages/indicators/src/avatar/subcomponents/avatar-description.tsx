import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AvatarDescriptionProps } from "../avatar.types";
import styles from "../avatar.module.css";
import { DESCRIPTION_SIZE_VARIANTS } from "../avatar.variants";

export const AvatarDescription = ({
  description,
  size,
  className,
  ...props
}: AvatarDescriptionProps) => {
  return (
    <Text
      data-slot="avatar-description"
      className={cx(styles["avatar-description"], className)}
      size={DESCRIPTION_SIZE_VARIANTS[size!]}
      {...props}
    >
      {description}
    </Text>
  );
};
AvatarDescription.displayName = "AvatarDescription";
