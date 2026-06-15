import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CardContainerProps } from "../card.types";
import { cardVariants } from "../card.variants";
import styles from "../card.module.css";

export const CardContainer = ({
  gap = 3,
  trimmed,
  transparent,
  ghost,
  inverted,
  className,
  children,
  ...props
}: CardContainerProps) => {
  return (
    <Stack
      data-slot="card-container"
      gap={gap}
      className={cx(
        styles["card"],
        cardVariants({ trimmed, transparent, ghost, inverted }),
        className,
      )}
      {...props}
    >
      {children}
    </Stack>
  );
};
CardContainer.displayName = "CardContainer";
