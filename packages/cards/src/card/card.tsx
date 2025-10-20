import { isValidElement } from "react";

import { Button, type ButtonProps } from "@uiid/buttons";
import { ArrowRight } from "@uiid/icons";
import { Stack, Group, ConditionalRender, Box } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import type { CardProps } from "./card.types";
import styles from "./card.module.css";
import { CLOSE_BUTTON_GUTTER } from "./card.constants";

import {
  CardIcon,
  CardTitle,
  CardClose,
  CardExternalLink,
} from "./subcomponents";

export const Card = ({
  size = "md",
  variant,
  title,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  onDismiss,
  render,
  className,
  children,
  ...props
}: CardProps) => {
  const isLink =
    "href" in props || (isValidElement(render) && "href" in render.props);
  const hasButtonProps = Boolean(
    primaryAction || secondaryAction || tertiaryAction || onDismiss,
  );

  const isExternalLink =
    (isLink && "target" in props && props.target === "_blank") ||
    (isValidElement(render) &&
      "target" in render.props &&
      render.props.target === "_blank");

  if (isLink && hasButtonProps) {
    throw new Error(
      "Card: Cannot use both link props (href) and button props (primaryAction, secondaryAction, tertiaryAction, onDismiss) together",
    );
  }

  const hasIcon = variant && variant !== "inverted";
  const hasHeader = Boolean(hasIcon || title);
  const hasActions = Boolean(
    primaryAction || secondaryAction || tertiaryAction,
  );
  const hasContent = Boolean(children);

  const sections = [hasHeader, hasContent, hasActions];
  const actions = [tertiaryAction, secondaryAction, primaryAction];

  const needsStack = sections.filter(Boolean).length > 1;

  // Determine the render element for link functionality
  let renderElement = render;
  if (!renderElement && "href" in props) {
    const { href, target, rel } = props as {
      href?: string;
      target?: string;
      rel?: string;
    };
    renderElement = <a href={href} target={target} rel={rel} />;
  }

  return (
    <Stack
      uiid="card"
      ax="stretch"
      gap={needsStack ? 4 : 0}
      data-size={size}
      data-variant={variant}
      className={cx(styles.card, className)}
      render={renderElement}
      {...props}
    >
      <ConditionalRender
        condition={hasHeader}
        wrapper={<Group ay="center" gap={2} />}
      >
        {hasIcon && <CardIcon variant={variant} />}
        {title && <CardTitle title={title} size={size} />}
        <Box style={{ marginLeft: "auto" }}>
          {!isLink && onDismiss && <CardClose onDismiss={onDismiss} />}
          {isExternalLink && <CardExternalLink />}
          {isLink && !isExternalLink && <ArrowRight size={16} />}
        </Box>
      </ConditionalRender>

      <Stack pr={!isLink && onDismiss ? CLOSE_BUTTON_GUTTER : 0}>
        <Text render={<p />} level={0}>
          {children}
        </Text>
      </Stack>

      {!isLink && (
        <ConditionalRender
          condition={hasActions}
          wrapper={<Group ax="end" ay="center" gap={2} mt={4} />}
        >
          {actions.map((action) => {
            if (!action) return null;

            let variant: ButtonProps["variant"] | undefined;
            if (action === secondaryAction) variant = "subtle";
            if (action === tertiaryAction) variant = "tertiary";

            return (
              <Button size="sm" onClick={action.onClick} variant={variant}>
                {action.text}
              </Button>
            );
          })}
        </ConditionalRender>
      )}

      {isLink}
    </Stack>
  );
};
Card.displayName = "Card";
