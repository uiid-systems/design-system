import { Group, Stack } from "@uiid/layout";
import { paletteColorStyles } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import { CARD_DEFAULT_COLOR } from "./card.constants";
import type { CardProps } from "./card.types";
import {
  CardContainer,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
  CardThumbnail,
} from "./subcomponents";

import styles from "./card.module.css";

export const Card = ({
  title,
  description,
  thumbnail,
  action,
  footer,
  variant,
  color = CARD_DEFAULT_COLOR,
  className,
  ContainerProps,
  HeaderProps,
  TitleProps,
  DescriptionProps,
  ActionProps,
  FooterProps,
  ThumbnailProps,
  InnerContainerProps,
  children,
  ...props
}: CardProps) => {
  const { className: containerClassName, ...containerProps } =
    ContainerProps ?? {};
  const { className: headerClassName, ...headerProps } = HeaderProps ?? {};

  const Description = DescriptionProps?.children || description;
  const Title = TitleProps?.children || title;
  const Action = ActionProps?.children || action;

  const hasTitle = Boolean(Title);
  const hasAction = Boolean(Action);
  const hasDescription = Boolean(Description);
  const hasHeader = hasTitle || hasDescription || hasAction;

  return (
    <CardContainer
      data-variant={variant}
      {...props}
      {...containerProps}
      className={cx(
        variant && styles[`variant-${variant}`],
        paletteColorStyles[color],
        className,
        containerClassName,
      )}
    >
      {thumbnail && (
        <CardThumbnail mb={2} {...ThumbnailProps}>
          {thumbnail}
        </CardThumbnail>
      )}

      {hasHeader && (
        <Group
          data-slot="card-header"
          ay="center"
          gap={3}
          fullwidth
          {...headerProps}
          className={cx(styles["card-header"], headerClassName)}
        >
          {hasAction && <CardAction {...ActionProps}>{Action}</CardAction>}
          {hasTitle && <CardTitle {...TitleProps}>{Title}</CardTitle>}
          {hasDescription && (
            <CardDescription {...DescriptionProps}>
              {Description}
            </CardDescription>
          )}
        </Group>
      )}

      {children && (
        <Stack
          data-slot="card-inner-container"
          fullwidth
          {...InnerContainerProps}
        >
          {children}
        </Stack>
      )}

      {footer && <CardFooter {...FooterProps}>{footer}</CardFooter>}
    </CardContainer>
  );
};
Card.displayName = "Card";
