import { Stack } from "@uiid/design-system";

import { ASIDE_WIDTH, SIDEBAR_SPACING } from "./constants";

export const AsideContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="aside"
      render={<aside />}
      maxw={ASIDE_WIDTH}
      gap={SIDEBAR_SPACING}
      px={SIDEBAR_SPACING}
      ax="stretch"
      fullwidth
      fullheight
      className="sticky top-20 overflow-y-auto max-h-screen"
    >
      {children}
    </Stack>
  );
};
AsideContainer.displayName = "AsideContainer";
