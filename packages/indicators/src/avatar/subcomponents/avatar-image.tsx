import { cx } from "@uiid/utils";

import type { AvatarImageProps } from "../avatar.types";
import styles from "../avatar.module.css";

export const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
  return (
    <span
      data-slot="avatar-image"
      className={cx(styles["avatar-image"], className)}
      {...props}
    />
  );
};
AvatarImage.displayName = "AvatarImage";
