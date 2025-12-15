import { Text } from "@uiid/typography";

import type { CardTitleProps } from "../card.types";
import { TITLE_LEVEL } from "../card.constants";

export const CardTitle = ({ title, size, ...props }: CardTitleProps) => {
  return (
    <Text render={<h3 />} level={TITLE_LEVEL[size!]} bold {...props}>
      {title}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
