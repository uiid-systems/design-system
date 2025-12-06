import { Text } from "@uiid/typography";

import type { CardTitleProps } from "../card.types";
import { TITLE_LEVEL } from "../card.constants";

export const CardTitle = ({ title, size }: CardTitleProps) => {
  return (
    <Text render={<h3 />} level={TITLE_LEVEL[size!]} bold>
      {title}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
