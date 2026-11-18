"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { AvatarInitialsProps } from "../avatar.types";

import styles from "../avatar.module.css";

/*
 * `Text` renders Base UI's `Avatar.Fallback`, which unmounts once the image
 * loads. A caller's `render` passes through to the fallback.
 */
export const AvatarInitials = ({
  initials,
  delay,
  render,
  className,
  ...props
}: AvatarInitialsProps) => {
  return (
    <Text
      data-slot="avatar-initials"
      className={cx(styles["avatar-initials"], className)}
      size={1}
      weight="bold"
      render={<BaseAvatar.Fallback delay={delay} render={render} />}
      {...props}
    >
      {initials}
    </Text>
  );
};
AvatarInitials.displayName = "AvatarInitials";
