import { Stack, Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";
import styles from "./card.module.css";

import { CardIcon, CardTitle, CardClose } from "./subcomponents";

export const Card = ({
  size = "md",
  variant,
  title,
  onClose,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <Stack
      uiid="card"
      ax="start"
      gap={4}
      pr={onClose ? 10 : 0}
      data-size={size}
      data-variant={variant}
      className={cx(styles.card, className)}
      {...props}
    >
      <Group ay="center" gap={2} fullwidth>
        {variant && variant !== "inverted" && <CardIcon variant={variant} />}
        {title && <CardTitle title={title} size={size} />}
        {onClose && <CardClose onClose={onClose} />}
      </Group>
      <Text render={<p />} level={0}>
        {children}
      </Text>
    </Stack>
  );
};
Card.displayName = "Card";
