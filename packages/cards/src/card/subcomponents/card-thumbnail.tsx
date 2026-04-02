import { cx } from "@uiid/utils";
import { Stack } from "@uiid/layout";

import type { CardThumbnailProps } from "../card.types";
import styles from "../card.module.css";

export const CardThumbnail = ({
  className,
  children,
  ...props
}: CardThumbnailProps) => {
  return (
    <Stack
      data-slot="card-thumbnail"
      className={cx(styles["card-thumbnail"], className)}
      ax="stretch"
      fullwidth
      {...props}
    >
      {children}
    </Stack>
  );
};
CardThumbnail.displayName = "CardThumbnail";
