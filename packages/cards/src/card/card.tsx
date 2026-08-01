import { Group, Stack, type StackProps } from "@uiid/layout";
import { paletteColorStyles } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";

import {
  CardContainer,
  CardHeader,
  CardIcon,
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
  icon,
  action,
  footer,
  variant,
  color,
  className,
  ContainerProps,
  HeaderProps,
  TitleProps,
  DescriptionProps,
  IconProps,
  ActionProps,
  FooterProps,
  ThumbnailProps,
  InnerContainerProps,
  children,
  ...props
}: CardProps) => {
  const { className: containerClassName, ...containerProps } =
    ContainerProps ?? {};

  const colorClassName = color
    ? cx(paletteColorStyles[color], styles["color-surface"])
    : undefined;

  const Description = DescriptionProps?.children || description;
  const Title = TitleProps?.children || title;
  const Action = ActionProps?.children || action;
  const Icon = IconProps?.icon || icon;

  const hasIcon = Boolean(Icon);
  const hasTitle = Boolean(Title);
  const hasAction = Boolean(Action);
  const hasDescription = Boolean(Description);
  const hasHeading = hasIcon || hasTitle;
  const hasLockup = hasHeading || hasDescription;
  const hasHeader = hasLockup || hasAction;

  return (
    <CardContainer
      data-variant={variant}
      {...props}
      {...containerProps}
      className={cx(
        variant && styles[`variant-${variant}`],
        colorClassName,
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
        <Group data-slot="card-header-region" ay="start" gap={3} fullwidth>
          {hasLockup && (
            <Stack className={styles["card-lockup"]} gap={1}>
              {hasHeading && (
                <CardHeader {...HeaderProps}>
                  {hasIcon && (
                    <Container>
                      <CardIcon icon={Icon} {...IconProps} />
                    </Container>
                  )}
                  {hasTitle && (
                    <Container>
                      <CardTitle {...TitleProps}>{Title}</CardTitle>
                    </Container>
                  )}
                </CardHeader>
              )}
              {hasDescription && (
                <CardDescription {...DescriptionProps}>
                  {Description}
                </CardDescription>
              )}
            </Stack>
          )}
          {hasAction && (
            <Container ml="auto" className={styles["card-action-cell"]}>
              <CardAction {...ActionProps}>{Action}</CardAction>
            </Container>
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

const Container = ({ children, className, ...props }: StackProps) => (
  <Stack
    className={cx(styles["card-header-cell"], className)}
    ay="center"
    {...props}
  >
    {children}
  </Stack>
);
