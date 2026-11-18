"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AvatarLayersProps } from "../avatar.types";
import { avatarVariants } from "../avatar.variants";

import styles from "../avatar.module.css";

/*
 * The `Layer` renders Base UI's `Avatar.Root`, which tracks the image's
 * loading status for `AvatarImage` and `AvatarInitials` inside it. A
 * caller's `render` passes through to the root so the context survives.
 */
export const AvatarLayers = ({
  color,
  render,
  className,
  children,
  ...props
}: AvatarLayersProps) => {
  return (
    <Layer
      data-slot="avatar-layers"
      className={cx(
        styles["avatar-layers"],
        avatarVariants({ color }),
        className,
      )}
      ax="center"
      ay="center"
      render={<BaseAvatar.Root render={render} />}
      {...props}
    >
      {children}
    </Layer>
  );
};
AvatarLayers.displayName = "AvatarLayers";
