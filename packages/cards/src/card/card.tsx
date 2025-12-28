import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";
import styles from "./card.module.css";
import { GAP_LEVEL } from "./card.constants";

import { CardHeader } from "./subcomponents";

export const Card = ({
  title,
  size = "md",
  trimmed,
  transparent,
  variant,
  className,
  children,
  ...props
}: CardProps) => {
  const hasHeaderProps = Boolean(title);
  return (
    <Stack
      uiid="card"
      ax="stretch"
      gap={GAP_LEVEL[size]}
      data-size={size}
      data-variant={variant}
      data-trimmed={trimmed}
      data-transparent={transparent}
      className={cx(styles["card"], className)}
      {...props}
    >
      {hasHeaderProps && (
        <CardHeader title={title} size={size} variant={variant} />
      )}

      {children}
    </Stack>
  );
};
Card.displayName = "Card";
