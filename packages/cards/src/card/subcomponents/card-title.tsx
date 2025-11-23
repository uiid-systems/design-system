import { Text } from "@uiid/typography";

import type { CardVariantProps } from "../card.types";
import { TITLE_LEVEL } from "../card.constants";

export type CardTitleProps = {
  title?: string;
} & Pick<CardVariantProps, "size">;

export const CardTitle = ({ title, size }: CardTitleProps) => {
  return (
    <Text render={<h3 />} level={TITLE_LEVEL[size!]} bold>
      {title}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
