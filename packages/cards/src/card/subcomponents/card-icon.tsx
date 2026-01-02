import { Info, Ban, TriangleAlert, CircleCheck } from "@uiid/icons";

import { ICON_SIZE, ICON_STROKE } from "../card.constants";
import type { CardIconProps } from "../card.types";

export const CardIcon = ({ variant, className }: CardIconProps) => {
  const iconProps = {
    size: ICON_SIZE,
    strokeWidth: ICON_STROKE,
    className,
  };

  const Icon = () => {
    if (variant === "inverted") return undefined;
    if (variant === "info") return <Info {...iconProps} />;
    if (variant === "warning") return <TriangleAlert {...iconProps} />;
    if (variant === "negative") return <Ban {...iconProps} />;
    if (variant === "positive") return <CircleCheck {...iconProps} />;
    return <Info {...iconProps} />;
  };

  return <Icon />;
};
CardIcon.displayName = "CardIcon";
