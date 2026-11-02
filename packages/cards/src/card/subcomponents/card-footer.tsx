import { Group, Separator } from "@uiid/layout";

import type { CardFooterProps } from "../card.types";

export const CardFooter = ({
  children,
  hideSeparator = true,
  ...props
}: CardFooterProps) => {
  return (
    <>
      {!hideSeparator && <Separator />}
      <Group data-slot="card-footer" gap={2} w="full" {...props}>
        {children}
      </Group>
    </>
  );
};
CardFooter.displayName = "CardFooter";
