"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cxState } from "@uiid/utils";

import type { AvatarImageProps } from "../avatar.types";

import styles from "../avatar.module.css";

export const AvatarImage = ({ className, ...props }: AvatarImageProps) => {
  return (
    <BaseAvatar.Image
      data-slot="avatar-image"
      className={cxState(styles["avatar-image"], className)}
      {...props}
    />
  );
};
AvatarImage.displayName = "AvatarImage";
