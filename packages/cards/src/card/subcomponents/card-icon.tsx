import { Info, Ban, TriangleAlert, CircleCheck } from "@uiid/icons";
import { ConditionalRender } from "@uiid/layout";

import { ICON_SIZE, ICON_STROKE } from "../card.constants";
import type { CardIconProps } from "../card.types";

export const CardIcon = ({
  tone,
  icon: IconProp,
  render,
  className,
}: CardIconProps) => {
  const iconProps = {
    size: ICON_SIZE,
    strokeWidth: ICON_STROKE,
    className,
  };

  const Icon = () => {
    if (IconProp) return <IconProp {...iconProps} />;
    if (tone === "info") return <Info {...iconProps} />;
    if (tone === "warning") return <TriangleAlert {...iconProps} />;
    if (tone === "critical") return <Ban {...iconProps} />;
    if (tone === "positive") return <CircleCheck {...iconProps} />;
    return null;
  };

  return (
    <ConditionalRender condition={!!render} render={render!}>
      <Icon />
    </ConditionalRender>
  );
};
CardIcon.displayName = "CardIcon";
