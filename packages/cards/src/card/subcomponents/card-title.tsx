import { Text } from "@uiid/typography";

import type { CardTitleProps } from "../card.types";

export const CardTitle = ({ children, ...props }: CardTitleProps) => {
  return (
    <Text
      data-slot="card-title"
      render={<h3 />}
      size={1}
      weight="semibold"
      {...props}
    >
      {children}
    </Text>
  );
};
CardTitle.displayName = "CardTitle";
