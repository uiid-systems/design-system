import type { Drawer, DialogProps } from "vaul";

export type DrawerProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  title: string;
  description: string;
  direction: DialogProps["direction"];
  RootProps?: typeof Drawer.Root;
  TriggerProps?: Omit<typeof Drawer.Trigger, "children">;
  PortalProps?: typeof Drawer.Portal;
  OverlayProps?: typeof Drawer.Overlay;
  ContentProps?: typeof Drawer.Content;
}>;
