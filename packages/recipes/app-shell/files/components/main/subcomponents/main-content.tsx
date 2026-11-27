import { Card } from "@uiid/design-system";

import { MAIN_CONTENT_MAX_WIDTH } from "../main.constants";
import type { MainContentProps } from "../main.types";

/** The page itself: the `<main>` element, as a `Card` with the `shell` variant. */
export const MainContent = ({ children, ...props }: MainContentProps) => {
  return (
    <Card
      data-slot="main-content"
      variant="shell"
      render={<main />}
      minw={0}
      maxw={MAIN_CONTENT_MAX_WIDTH}
      {...props}
    >
      {children}
    </Card>
  );
};
MainContent.displayName = "MainContent";
