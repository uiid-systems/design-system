import { Group } from "@uiid/layout";

import type { CardHeaderProps } from "../card.types";

export const CardHeader = ({ children, ...props }: CardHeaderProps) => {
  return (
    <Group data-slot="card-header" ay="center" gap={2} fullwidth {...props}>
      {children}
    </Group>
  );
};
CardHeader.displayName = "CardHeader";
