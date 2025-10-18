import { Button } from "@uiid/buttons";
import { Stack, Group, ConditionalRender } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";
import styles from "./card.module.css";
import { CLOSE_BUTTON_GUTTER } from "./card.constants";

import { CardIcon, CardTitle, CardClose } from "./subcomponents";

export const Card = ({
  size = "md",
  variant,
  title,
  onDismiss,
  onSubmit,
  onCancel,
  className,
  children,
  ...props
}: CardProps) => {
  const hasIcon = variant && variant !== "inverted";
  const hasHeader = Boolean(hasIcon || title);
  const hasActions = Boolean(onSubmit || onCancel);

  return (
    <Stack
      uiid="card"
      ax="stretch"
      data-size={size}
      data-variant={variant}
      className={cx(styles.card, className)}
      {...props}
    >
      {onDismiss && <CardClose onDismiss={onDismiss} />}

      <ConditionalRender
        condition={hasHeader}
        wrapper={<Group ay="center" gap={2} mb={6} />}
      >
        {hasIcon && <CardIcon variant={variant} />}
        {title && <CardTitle title={title} size={size} />}
      </ConditionalRender>

      <Stack pr={onDismiss ? CLOSE_BUTTON_GUTTER : 0}>
        <Text render={<p />} level={0}>
          {children}
        </Text>
      </Stack>

      <ConditionalRender
        condition={hasActions}
        wrapper={<Group ax="end" ay="center" gap={2} mt={8} />}
      >
        {onCancel && (
          <Button size="sm" fill="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {onSubmit && (
          <Button size="sm" onClick={onSubmit}>
            Submit
          </Button>
        )}
      </ConditionalRender>
    </Stack>
  );
};
Card.displayName = "Card";
