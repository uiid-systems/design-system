import { ConditionalRender } from "@uiid/layout";

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

export const Card = ({
  title,
  description,
  thumbnail,
  icon,
  action,
  footer,
  size,
  ContainerProps,
  HeaderProps,
  TitleProps,
  DescriptionProps,
  IconProps,
  ActionProps,
  FooterProps,
  ThumbnailProps,
  children,
  ...props
}: CardProps) => {
  const Description = DescriptionProps?.children || description;
  const Title = TitleProps?.children || title;
  const Action = ActionProps?.children || action;
  const Icon = IconProps?.icon || icon;

  return (
    <CardContainer size={size} {...props} {...ContainerProps}>
      {thumbnail && (
        <CardThumbnail mb={2} {...ThumbnailProps}>
          {thumbnail}
        </CardThumbnail>
      )}

      <ConditionalRender
        condition={Boolean(title || icon || action)}
        render={<CardHeader {...HeaderProps} />}
      >
        {Icon && <CardIcon icon={Icon} {...IconProps} />}
        {Title && <CardTitle {...TitleProps}>{Title}</CardTitle>}
        {Action && <CardAction {...ActionProps}>{Action}</CardAction>}
      </ConditionalRender>

      {Description && (
        <CardDescription {...DescriptionProps}>{Description}</CardDescription>
      )}

      {children}

      {footer && (
        <CardFooter mt={4} {...FooterProps}>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};
Card.displayName = "Card";
