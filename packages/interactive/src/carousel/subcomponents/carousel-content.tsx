import { cx } from "@uiid/utils";
import { Stack, type StackProps } from "@uiid/layout";

import styles from "./carousel-content.module.css";

export const CarouselContent = ({
  className,
  children,
  ...props
}: StackProps) => {
  return (
    <Stack
      data-slot="carousel-content"
      className={cx(styles["carousel-content"], className)}
      {...props}
    >
      {children}
    </Stack>
  );
};
CarouselContent.displayName = "CarouselContent";
