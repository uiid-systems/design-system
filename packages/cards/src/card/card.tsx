import { Stack } from "@uiid/layout";
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
      gap={3}
      className={cx(
        styles["card"],
        cardVariants({ tone, trimmed, transparent, inverted }),
        className,
      )}
      {...props}
    >
      <CardHeader {...HeaderProps}>
        {title && <CardIcon tone={tone} icon={icon} {...IconProps} />}
        {title && <CardTitle {...TitleProps}>{title}</CardTitle>}
        {action && <CardAction {...ActionProps}>{action}</CardAction>}
      </CardHeader>

      {description && (
        <CardDescription {...DescriptionProps}>{description}</CardDescription>
      )}

      {children}

      {footer && <CardFooter {...FooterProps}>{footer}</CardFooter>}
    </Stack>
  );
};
Card.displayName = "Card";
