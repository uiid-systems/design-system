import { mergeProps } from "@base-ui/react/merge-props";
import { Group, Stack } from "@uiid/layout";
import { paletteColorStyles } from "@uiid/tokens";
import { cx, isRenderable } from "@uiid/utils";

import {
  CARD_DEFAULT_COLOR,
  SHELL_CONTAINER_PROPS,
  SHELL_GAP,
  SHELL_PADDING,
  SHELL_TITLE_PROPS,
} from "./card.constants";
import type { CardProps } from "./card.types";
import { inlinePadding, isTextContent, resolveCardPadding } from "./card.utils";
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
  color,
  shadow = false,
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
  p,
  px,
  py,
  pl,
  pr,
  pt,
  pb,
  ...props
}: CardProps) => {
  const {
    className: containerClassName,
    p: containerP,
    px: containerPx,
    py: containerPy,
    pl: containerPl,
    pr: containerPr,
    pt: containerPt,
    pb: containerPb,
    ...containerProps
  } = ContainerProps ?? {};
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

  const isShell = variant === "shell";
  const surfaceColor = isShell ? color : (color ?? CARD_DEFAULT_COLOR);

  // ContainerProps lands on the same element, so its padding wins, then the
  // root's, then the shell's default. Unset sides keep the stylesheet's.
  const padding = resolveCardPadding(
    {
      p: containerP,
      px: containerPx,
      py: containerPy,
      pl: containerPl,
      pr: containerPr,
      pt: containerPt,
      pb: containerPb,
    },
    { p, px, py, pl, pr, pt, pb },
    isShell ? { p: SHELL_PADDING } : undefined,
  );

  // Published so children can reach the card's edge, e.g. a full-bleed
  // separator or a scrolling body, without re-deriving the padding.
  const paddingStyle = {
    "--card-padding-inline-start": inlinePadding(padding.start),
    "--card-padding-inline-end": inlinePadding(padding.end),
  } as React.CSSProperties;

  // A composed (non-text) title keeps CardTitle's row render.
  const shellTitleProps = isShell
    ? {
        ...SHELL_TITLE_PROPS,
        ...(isTextContent(Title) && { render: <h2 /> }),
      }
    : undefined;

  return (
    <CardContainer
      data-variant={variant}
      // ContainerProps lands on the same element, so its style and handlers
      // merge with the root's rather than replacing them.
      {...(isShell && SHELL_CONTAINER_PROPS)}
      {...mergeProps<"div">({ style: paddingStyle }, props, containerProps)}
      pt={padding.top}
      pb={padding.bottom}
      pl={padding.start}
      pr={padding.end}
      className={cx(
        shadow && styles.shadow,
        variant && styles[`variant-${variant}`],
        surfaceColor ? paletteColorStyles[surfaceColor] : styles["uncolored"],
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
          w="full"
          {...headerProps}
          className={cx(styles["card-header"], headerClassName)}
        >
          {hasAction && <CardAction {...ActionProps}>{Action}</CardAction>}
          {hasTitle && (
            <CardTitle {...shellTitleProps} {...TitleProps}>
              {Title}
            </CardTitle>
          )}
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
          w="full"
          grow={props.grow}
          gap={isShell ? SHELL_GAP : undefined}
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
