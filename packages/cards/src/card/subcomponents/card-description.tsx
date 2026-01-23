import { Text } from "@uiid/typography";

import type { CardDescriptionProps } from "../card.types";

export const CardDescription = ({
  children,
  ...props
}: CardDescriptionProps) => {
  return (
    <Text
      data-slot="card-description"
      render={<p />}
      shade="muted"
      balance
      {...props}
    >
      {children}
    </Text>
  );
};
CardDescription.displayName = "CardDescription";
