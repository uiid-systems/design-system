import { Stack } from "@uiid/design-system";
import { cx } from "@uiid/design-system/utils";

import { MAIN_ASIDE_SPACING, MAIN_ASIDE_WIDTH } from "../main.constants";
import type { MainAsideProps } from "../main.types";

import styles from "../main.module.css";

/** Sticks beside the page, and scrolls on its own when it is taller than the track. */
export const MainAside = ({
  className,
  children,
  ...props
}: MainAsideProps) => {
  return (
    <Stack
      data-slot="main-aside"
      render={<aside />}
      className={cx(styles["main-aside"], className)}
      maxw={MAIN_ASIDE_WIDTH}
      gap={MAIN_ASIDE_SPACING}
      p={MAIN_ASIDE_SPACING}
      w="full"
      maxh="full"
      {...props}
    >
      {children}
    </Stack>
  );
};
MainAside.displayName = "MainAside";
