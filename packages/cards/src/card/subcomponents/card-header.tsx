"use client";

import { Button, type ButtonProps } from "@uiid/buttons";
import { Group } from "@uiid/layout";

import type { CardVariantProps } from "../card.types";

import { CardTitle, type CardTitleProps } from "./card-title";
import { CardIcon } from "./card-icon";

export type CardHeaderProps = {
  action?: Required<Pick<ButtonProps, "icon" | "aria-label" | "onClick">>;
} & Pick<CardVariantProps, "variant"> &
  CardTitleProps;

export const CardHeader = ({
  variant,
  action,
  title,
  size,
}: CardHeaderProps) => {
  return (
    <Group data-slot="card-header" ay="center" gap={2}>
      {variant && <CardIcon variant={variant} />}
      <CardTitle title={title} size={size} />
      {action && (
        <Button
          shape="pill"
          size="icon"
          {...action}
          style={{ marginInlineStart: "auto" }}
        />
      )}
    </Group>
  );
};
CardHeader.displayName = "CardHeader";
