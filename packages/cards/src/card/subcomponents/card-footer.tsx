import { Group } from "@uiid/layout";

import type { CardFooterProps } from "../card.types";

export const CardFooter = ({ children, ...props }: CardFooterProps) => {
  return (
    <Group data-slot="card-footer" gap={2} fullwidth {...props}>
      {children}
    </Group>
  );
};
CardFooter.displayName = "CardFooter";
