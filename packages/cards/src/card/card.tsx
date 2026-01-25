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
} from "./subcomponents";

export const Card = ({
  title,
  description,
  icon,
  action,
  footer,
  tone,
  size,
  ContainerProps,
  HeaderProps,
  TitleProps,
  DescriptionProps,
  IconProps,
  ActionProps,
  FooterProps,
  children,
  ...props
}: CardProps) => {
  const Description = DescriptionProps?.children || description;
  const Title = TitleProps?.children || title;
  const Action = ActionProps?.children || action;
  const Icon = IconProps?.icon || icon;

  return (
    <CardContainer tone={tone} size={size} {...props} {...ContainerProps}>
      <ConditionalRender
        condition={Boolean(title || icon || action)}
        render={
          <CardHeader mb={!description ? 8 : undefined} {...HeaderProps} />
        }
      >
        {Icon && <CardIcon tone={tone} icon={Icon} {...IconProps} />}
        {Title && <CardTitle {...TitleProps}>{Title}</CardTitle>}
        {Action && <CardAction {...ActionProps}>{Action}</CardAction>}
      </ConditionalRender>

      {Description && (
        <CardDescription mb={4} {...DescriptionProps}>
          {Description}
        </CardDescription>
      )}

      {children}

      {footer && <CardFooter {...FooterProps}>{footer}</CardFooter>}
    </CardContainer>
  );
};
Card.displayName = "Card";
