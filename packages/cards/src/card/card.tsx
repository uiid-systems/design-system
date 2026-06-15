import { ConditionalRender, Stack, type StackProps } from "@uiid/layout";
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
  const Description = DescriptionProps?.children || description;
  const Title = TitleProps?.children || title;
  const Action = ActionProps?.children || action;
  const Icon = IconProps?.icon || icon;

  const hasIcon = Boolean(Icon);
  const hasTitle = Boolean(Title);
  const hasAction = Boolean(Action);
  const hasDescription = Boolean(Description);
  const hasHeader = hasIcon || hasTitle || hasAction;

  return (
    <CardContainer {...props} {...ContainerProps}>
      {thumbnail && (
        <CardThumbnail mb={2} {...ThumbnailProps}>
          {thumbnail}
        </CardThumbnail>
      )}

      {(hasHeader || hasDescription) && (
        <ConditionalRender
          condition={hasHeader && hasDescription}
          render={<Stack gap={2} fullwidth />}
        >
          {hasHeader && (
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
              {hasAction && (
                <Container ml="auto">
                  <CardAction {...ActionProps}>{Action}</CardAction>
                </Container>
              )}
            </CardHeader>
          )}
          {hasDescription && (
            <CardDescription {...DescriptionProps}>
              {Description}
            </CardDescription>
          )}
        </ConditionalRender>
      )}

      {children && (
        <Stack data-slot="card-inner-container" my={2} {...InnerContainerProps}>
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
