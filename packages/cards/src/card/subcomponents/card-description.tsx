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
      // shade="accent"
      size={-1}
      mb={1}
      balance
      weight="bold"
      {...props}
    >
      {children}
    </Text>
  );
};
CardDescription.displayName = "CardDescription";
