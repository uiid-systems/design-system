import type { Drawer, DialogProps, ContentProps } from "vaul";

export type DrawerProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  title: string;
  description: string;
  direction: DialogProps["direction"];
  RootProps?: Omit<DialogProps, "children">;
  TriggerProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Drawer.Trigger>,
    "children"
  >;
  ContentProps?: ContentProps;
}>;
