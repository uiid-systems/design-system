import type { Drawer } from "vaul";

export type DrawerProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  RootProps?: typeof Drawer.Root;
  TriggerProps?: Omit<typeof Drawer.Trigger, "children">;
  PortalProps?: typeof Drawer.Portal;
  OverlayProps?: typeof Drawer.Overlay;
  ContentProps?: typeof Drawer.Content;
}>;
