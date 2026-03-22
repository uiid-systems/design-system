import { ConditionalRender } from "@uiid/layout";

import { ICON_SIZE, ICON_STROKE } from "../card.constants";
import type { CardIconProps } from "../card.types";

export const CardIcon = ({
  icon: IconProp,
  render,
  className,
}: CardIconProps) => {
  const iconProps = {
    size: ICON_SIZE,
    strokeWidth: ICON_STROKE,
    className,
  };

  return (
    <ConditionalRender condition={!!render} render={render!}>
      {IconProp ? <IconProp {...iconProps} /> : null}
    </ConditionalRender>
  );
};
CardIcon.displayName = "CardIcon";
