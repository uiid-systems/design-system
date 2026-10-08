"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { Button } from "@uiid/buttons";
import { ChevronRightIcon } from "@uiid/icons/chevron-right";
import { Text } from "@uiid/typography";
import { useId } from "react";

import { Card } from "../card/card";
import type { CollapsibleCardProps } from "./collapsible-card.types";

import styles from "./collapsible-card.module.css";

export const CollapsibleCard = ({
  title,
  footer,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  TitleProps,
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
      render={({ color: _htmlColor, ...rootProps }, state) => (
        <Card
          {...props}
          {...rootProps}
          title={lockup}
          TitleProps={TitleProps}
          InnerContainerProps={{
            ...InnerContainerProps,
            render: <Collapsible.Panel />,
          }}
          footer={state.open ? footer : undefined}
        >
          {children}
        </Card>
      )}
    />
  );
};
CollapsibleCard.displayName = "CollapsibleCard";
