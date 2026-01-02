import { ConditionalRender, Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";
import { cardVariants } from "./card.variants";
import styles from "./card.module.css";

import { CardIcon, CardTitle } from "./subcomponents";

export const Card = ({
  /** data */
  title,
  /** variants */
  size,
  variant,
  trimmed,
  transparent,
  /** subcomponents */
  TitleProps,
  IconProps,
  /** misc */
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <Stack
      data-slot="card"
      ax="stretch"
      gap={3}
      className={cx(
        styles["card"],
        cardVariants({ size, variant, trimmed, transparent }),
        className,
      )}
      {...props}
    >
      <ConditionalRender
        condition={Boolean(variant && title)}
        render={<Group ay="center" gap={2} />}
      >
        {title && variant && <CardIcon variant={variant} {...IconProps} />}
        {title && <CardTitle {...TitleProps}>{title}</CardTitle>}
      </ConditionalRender>
      {children}
    </Stack>
  );
};
Card.displayName = "Card";
