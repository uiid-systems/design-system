import { Info, Ban, TriangleAlert, CircleCheck } from "@uiid/icons";

import { ICON_SIZE, ICON_STROKE } from "../card.constants";
import type { CardProps } from "../card.types";

export type CardIconProps = Pick<CardProps, "variant" | "className">;

export const CardIcon = ({ variant, className }: CardIconProps) => {
  const iconProps = {
    size: ICON_SIZE,
    strokeWidth: ICON_STROKE,
    className,
  };

  const Icon = () => {
    if (variant === "info") return <Info {...iconProps} />;
    if (variant === "warning") return <TriangleAlert {...iconProps} />;
    if (variant === "error") return <Ban {...iconProps} />;
    if (variant === "success") return <CircleCheck {...iconProps} />;
    return <Info {...iconProps} />;
  };

  return <Icon />;
};
CardIcon.displayName = "CardIcon";
