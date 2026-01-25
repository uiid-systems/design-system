import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { CARD_DEFAULT_GAP } from "../card.constants";
import type { CardContainerProps } from "../card.types";
import { cardVariants } from "../card.variants";
import styles from "../card.module.css";

export const CardContainer = ({
  gap = CARD_DEFAULT_GAP,
  tone,
  trimmed,
  transparent,
  ghost,
  inverted,
  size,
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
        cardVariants({ tone, trimmed, transparent, ghost, inverted, size }),
        className,
      )}
      {...props}
    >
      {children}
    </Stack>
  );
};
CardContainer.displayName = "CardContainer";
