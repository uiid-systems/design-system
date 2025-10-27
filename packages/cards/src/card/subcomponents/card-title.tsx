import { Text } from "@uiid/typography";

import type { CardProps } from "../card.types";
import { TITLE_LEVEL } from "../card.constants";

export type CardTitleProps = Pick<CardProps, "size" | "title" | "render">;

export const CardTitle = ({ title, size, render }: CardTitleProps) => {
  return (
    <Text
      render={render || <h2 />}
      level={size ? TITLE_LEVEL[size] : undefined}
      bold
    >
      {title}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
