"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Button } from "@uiid/buttons";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";
import { useId } from "react";

import { Card } from "../card/card";
import type { CollapsibleCardProps } from "./collapsible-card.types";

import styles from "./collapsible-card.module.css";

export const CollapsibleCard = ({
  title,
  color,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  keepMounted,
  clickableHeader,
  className,
  HeaderProps,
  TitleProps,
  ActionProps,
  InnerContainerProps,
  children,
  ref,
  ...props
}: CollapsibleCardProps) => {
  const titleId = useId();

  /*
   * The chevron makes the title a composed row rather than a heading, so the
   * heading moves onto the text. It takes CardTitle's size and weight, or the
   * caller's `TitleProps` overrides.
   */
  const lockup = (
    <>
      <Collapsible.Trigger
        render={({ color: _htmlColor, ...triggerProps }) => (
          <Button
            {...triggerProps}
            color={color}
            shape="square"
            size="xsmall"
            variant="ghost"
            aria-labelledby={titleId}
            className={styles["collapsible-card-trigger"]}
          >
            <ChevronRightIcon />
          </Button>
        )}
      />
      <Text
        id={titleId}
        render={<h3 />}
        size={TitleProps?.size ?? 1}
        weight={TitleProps?.weight ?? "semibold"}
      >
        {title}
      </Text>
    </>
  );

  /*
   * Base UI types the render props with the HTML `color` attribute, which
   * clashes with the palette `color` Card and Button take. Nothing sets it,
   * so it is dropped before spreading.
   */
  return (
    <Collapsible.Root
      ref={ref}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      render={({ color: _htmlColor, ...rootProps }) => (
        <Card
          {...props}
          {...rootProps}
          // Base UI doesn't document `data-disabled` on the root, so the card
          // sets it from its own prop for the disabled dim to key off.
          data-disabled={disabled ? "" : undefined}
          className={cx(styles["collapsible-card"], className)}
          color={color}
          title={lockup}
          HeaderProps={{
            ...HeaderProps,
            className: cx(
              clickableHeader && styles["clickable-header"],
              HeaderProps?.className,
            ),
          }}
          TitleProps={TitleProps}
          // `inert` because the action is the caller's content: the card can't
          // disable each control in it, only take the whole slot out of reach.
          ActionProps={disabled ? { ...ActionProps, inert: true } : ActionProps}
          InnerContainerProps={{
            ...InnerContainerProps,
            render: (
              <Collapsible.Panel
                keepMounted={keepMounted}
                className={styles["collapsible-card-panel"]}
              />
            ),
          }}
        >
          {children}
        </Card>
      )}
    />
  );
};
CollapsibleCard.displayName = "CollapsibleCard";
