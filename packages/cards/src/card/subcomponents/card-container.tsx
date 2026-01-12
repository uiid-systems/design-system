import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "../card.module.css";
import { cardVariants } from "../card.variants";
import type { CardContainerProps } from "../card.types";

export const CardContainer = ({
  tone,
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
      gap={3}
      className={cx(
        styles["card"],
        cardVariants({ tone, trimmed, transparent, ghost, inverted }),
        className,
      )}
      {...props}
    >
      {children}
    </Stack>
  );
};
CardContainer.displayName = "CardContainer";
