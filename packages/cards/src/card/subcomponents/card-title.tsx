import { Text } from "@uiid/typography";

import { ICON_SIZE } from "../card.constants";
import type { CardTitleProps } from "../card.types";

export const CardTitle = ({ children, style, ...props }: CardTitleProps) => {
  return (
    <Text
      data-slot="card-title"
      render={<h3 />}
      style={{ minHeight: `${ICON_SIZE}px`, alignContent: "center", ...style }}
      size={1}
      weight="bold"
      {...props}
    >
      {children}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
