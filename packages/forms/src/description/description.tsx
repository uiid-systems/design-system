import { Text } from "@uiid/typography";

import type { DescriptionProps } from "./description.types";

export const Description = ({ children, ...props }: DescriptionProps) => {
  return (
    <Text
      data-slot="description"
      render={<span />}
      level={-1}
      shade="accent"
      {...props}
    >
      {children}
    </Text>
  );
};
Description.displayName = "Description";
