import { Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AvatarLayersProps } from "../avatar.types";
import { avatarVariants } from "../avatar.variants";

import styles from "../avatar.module.css";

export const AvatarLayers = ({
  color,
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
      {...props}
    >
      {children}
    </Layer>
  );
};
AvatarLayers.displayName = "AvatarLayers";
