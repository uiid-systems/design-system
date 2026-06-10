import { ConditionalRender, Stack, type StackProps } from "@uiid/layout";

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
import { ICON_SIZE } from "./card.constants";

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
  InnerContainerProps,
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
        <Container>{Icon && <CardIcon icon={Icon} {...IconProps} />}</Container>

        <Container>
          {Title && <CardTitle {...TitleProps}>{Title}</CardTitle>}
          {Description && (
            <CardDescription {...DescriptionProps}>
              {Description}
            </CardDescription>
          )}
        </Container>
        <Container ml="auto">
          {Action && <CardAction {...ActionProps}>{Action}</CardAction>}
        </Container>
      </ConditionalRender>

      <Stack data-slot="card-inner-container" my={2} {...InnerContainerProps}>
        {children}
      </Stack>

      {footer && <CardFooter {...FooterProps}>{footer}</CardFooter>}
    </CardContainer>
  );
};
Card.displayName = "Card";

const Container = ({ children, ...props }: StackProps) => (
  <Stack minh={ICON_SIZE * 1.5} ay="center" {...props}>
    {children}
  </Stack>
);
