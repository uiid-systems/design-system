import { cx, Stack } from "@uiid/design-system";

import { ASIDE_WIDTH, SIDEBAR_SPACING } from "./constants";

import styles from "./shell.module.css";

export const AsideContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="aside"
      render={<aside />}
      maxw={ASIDE_WIDTH}
      gap={SIDEBAR_SPACING}
      p={SIDEBAR_SPACING}
      w="full"
      maxh="full"
      className={cx(styles.aside, styles.scroll)}
    >
      {children}
    </Stack>
  );
};
AsideContainer.displayName = "AsideContainer";
