import { mergeProps } from "@base-ui/react/merge-props";
import { Group, Stack } from "@uiid/layout";
import { paletteColorStyles } from "@uiid/tokens";
import { cx, isRenderable } from "@uiid/utils";

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

  // A slot's own `children` win when they render anything — see `isRenderable`.
  const slot = (own: React.ReactNode, fallback: React.ReactNode) =>
    isRenderable(own) ? own : fallback;

  const Description = slot(DescriptionProps?.children, description);
  const Title = slot(TitleProps?.children, title);
  const Action = slot(ActionProps?.children, action);

  const hasTitle = isRenderable(Title);
  const hasAction = isRenderable(Action);
  const hasDescription = isRenderable(Description);
  const hasHeader = hasTitle || hasDescription || hasAction;

  return (
    <CardContainer
      data-variant={variant}
      // ContainerProps lands on the same element, so its style and handlers
      // merge with the root's rather than replacing them.
      {...mergeProps<"div">(props, containerProps)}
      className={cx(
        variant && styles[`variant-${variant}`],
        paletteColorStyles[color],
        className,
        containerClassName,
      )}
    >
      {isRenderable(thumbnail) && (
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

      {isRenderable(children) && (
        <Stack
          data-slot="card-inner-container"
          fullwidth
          {...InnerContainerProps}
        >
          {children}
        </Stack>
      )}

      {isRenderable(footer) && (
        <CardFooter {...FooterProps}>{footer}</CardFooter>
      )}
    </CardContainer>
  );
};
Card.displayName = "Card";
