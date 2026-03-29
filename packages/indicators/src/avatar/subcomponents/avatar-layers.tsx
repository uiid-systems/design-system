import { Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "../avatar.module.css";
import type { AvatarLayersProps } from "../avatar.types";
import { avatarVariants } from "../avatar.variants";

export const AvatarLayers = ({
  size,
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
        avatarVariants({ size, color }),
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
