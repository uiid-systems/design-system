import { Layer } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { AvatarLayersProps } from "../avatar.types";
import styles from "../avatar.module.css";

export const AvatarLayers = ({
  className,
  children,
  ...props
}: AvatarLayersProps) => {
  return (
    <Layer
      data-slot="avatar-layers"
      className={cx(styles["avatar-layers"], className)}
      ax="center"
      ay="center"
      fullwidth
      {...props}
    >
      {children}
    </Layer>
  );
};
AvatarLayers.displayName = "AvatarLayers";
