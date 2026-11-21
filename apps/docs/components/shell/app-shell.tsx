import { Card, cx, Group, Stack } from "@uiid/design-system";

import { CONTENT_MAX_WIDTH } from "./constants";

import styles from "./shell.module.css";

type BodyProps = React.PropsWithChildren<{ className?: string }>;

/** The viewport. It never scrolls; the sidebar and the content row do. */
export const Body = ({ children, className }: BodyProps) => {
  return (
    <Stack
      data-slot="body"
      render={<body />}
      className={cx(styles.body, className)}
      h="screen"
      w="full"
    >
      {children}
    </Stack>
  );
};
Body.displayName = "Body";

/** The sidebar and the inner column, side by side at full height. */
export const AppShellOuter = ({ children }: React.PropsWithChildren) => {
  return (
    <Group
      data-slot="app-shell-outer"
      className={styles.outer}
      ay="stretch"
      w="full"
      grow
    >
      {children}
    </Group>
  );
};
AppShellOuter.displayName = "AppShellOuter";

/** The header stacked over the scrolling content row. */
export const AppShellInner = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack data-slot="app-shell-inner" grow>
      {children}
    </Stack>
  );
};
AppShellInner.displayName = "AppShellInner";

/**
 * The content scroll track: the page and its aside scroll together here.
 * Its children slide aside for the sidebar; see shell.module.css.
 */
export const ContentRow = ({ children }: React.PropsWithChildren) => {
  return (
    <Group
      data-slot="content-row"
      className={cx(styles.scroll, styles.content)}
      ay="start"
      w="full"
      grow
    >
      {children}
    </Group>
  );
};
ContentRow.displayName = "ContentRow";

export const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <Card
      data-slot="main"
      variant="shell"
      render={<main />}
      minw={0}
      maxw={CONTENT_MAX_WIDTH}
    >
      {children}
    </Card>
  );
};
Main.displayName = "Main";
