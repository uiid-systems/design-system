import { Stack, ConditionalRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";
import { cardVariants } from "./card.variants";
import styles from "./card.module.css";

import {
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "./subcomponents";

export const Card = ({
  title,
  description,
  icon,
  action,
  footer,
  tone,
  trimmed,
  transparent,
  inverted,
  HeaderProps,
  TitleProps,
  DescriptionProps,
  IconProps,
  ActionProps,
  FooterProps,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <Stack
      data-slot="card"
      className={cx(
        styles["card"],
        cardVariants({ tone, trimmed, transparent, inverted }),
        className,
      )}
      gap={3}
      {...props}
    >
      <ConditionalRender
        condition={Boolean(title || icon || action)}
        render={<CardHeader {...HeaderProps} />}
      >
        {title && <CardIcon tone={tone} icon={icon} {...IconProps} />}
        {title && <CardTitle {...TitleProps}>{title}</CardTitle>}
        {action && <CardAction {...ActionProps}>{action}</CardAction>}
      </ConditionalRender>

      {description && (
        <CardDescription {...DescriptionProps}>{description}</CardDescription>
      )}

      {children}

      {footer && <CardFooter {...FooterProps}>{footer}</CardFooter>}
    </Stack>
  );
};
Card.displayName = "Card";
