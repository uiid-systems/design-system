import { Group, Stack } from "@uiid/design-system";

import {
  CONTENT_MAX_WIDTH,
  SHELL_SPACING,
  SHELL_BORDER_WIDTH,
} from "./constants";

type BodyProps = React.PropsWithChildren<{ className?: string }>;

export const Body = ({ children, className }: BodyProps) => {
  return (
    <Stack
      data-slot="body"
      render={<body />}
      className={["antialiased min-h-screen", className]
        .filter(Boolean)
        .join(" ")}
      fullwidth
    >
      {children}
    </Stack>
  );
};
Body.displayName = "Body";

export const AppShellOuter = ({ children }: React.PropsWithChildren) => {
  return (
    <Group data-slot="app-shell-outer" fullwidth>
      {children}
    </Group>
  );
};
AppShellOuter.displayName = "AppShellOuter";

export const AppShellInner = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack data-slot="app-shell-inner" className="flex-1">
      {children}
    </Stack>
  );
};
AppShellInner.displayName = "AppShellInner";

export const ContentRow = ({ children }: React.PropsWithChildren) => {
  return (
    <Group data-slot="content-row" className="flex-1" ay="start" fullwidth>
      {children}
    </Group>
  );
};
ContentRow.displayName = "ContentRow";

export const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <Stack
      data-slot="main"
      render={<main />}
      className="min-w-0"
      maxw={CONTENT_MAX_WIDTH}
      br={SHELL_BORDER_WIDTH}
      p={SHELL_SPACING * 2}
      fullwidth
      fullheight
    >
      {children}
    </Stack>
  );
};
Main.displayName = "Main";
