import { Button, type ButtonProps } from "@uiid/buttons";
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
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onDismiss,
  className,
  children,
  ...props
}: CardProps) => {
  const hasIcon = variant && variant !== "inverted";
  const hasHeader = Boolean(hasIcon || title);
  const hasActions = Boolean(
    primaryAction || secondaryAction || tertiaryAction,
  );
  const hasContent = Boolean(children);

  const sections = [hasHeader, hasActions, hasContent];
  const actions = [tertiaryAction, secondaryAction, primaryAction];

  const needsStack = sections.filter(Boolean).length > 1;

  return (
    <Stack
      uiid="card"
      ax="stretch"
      gap={needsStack ? 4 : 0}
      data-size={size}
      data-variant={variant}
      className={cx(styles.card, className)}
      {...props}
    >
      <ConditionalRender
        condition={hasHeader}
        wrapper={<Group ay="center" gap={2} />}
      >
        {hasIcon && <CardIcon variant={variant} />}
        {title && <CardTitle title={title} size={size} />}
        {onDismiss && <CardClose onDismiss={onDismiss} />}
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
        {actions.map((action) => {
          if (!action) return null;

          let variant: ButtonProps["variant"] | undefined;
          if (action === secondaryAction) variant = "subtle";
          if (action === tertiaryAction) variant = "tertiary";

          return (
            <Button size="sm" onClick={action.onClick} variant={variant}>
              {action.text}
            </Button>
          );
        })}
      </ConditionalRender>
    </Stack>
  );
};
Card.displayName = "Card";
