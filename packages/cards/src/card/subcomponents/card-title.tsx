import { Text } from "@uiid/typography";

import type { CardTitleProps } from "../card.types";

export const CardTitle = ({ children, ...props }: CardTitleProps) => {
  return (
    <Text render={<h3 />} size={1} weight="bold" {...props}>
      {children}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
