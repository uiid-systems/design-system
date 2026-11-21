import { Stack } from "@uiid/design-system";

import { ASIDE_WIDTH, SIDEBAR_SPACING } from "./constants";

export const AsideContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="aside"
      render={<aside />}
      maxw={ASIDE_WIDTH}
      gap={SIDEBAR_SPACING}
      p={SIDEBAR_SPACING}
      w="full"
      className="sticky top-0"
    >
      {children}
    </Stack>
  );
};
AsideContainer.displayName = "AsideContainer";
