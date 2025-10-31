import type { Drawer, DialogProps, ContentProps } from "vaul";

export type DrawerProps = React.PropsWithChildren<{
  /** The trigger element to open the drawer. */
  trigger: React.ReactNode;
  /** The title of the drawer. */
  title: string;
  /**
   * The props for the root element.
   * @see https://vaul.emilkowal.ski/api#root
   * */
  RootProps?: Omit<DialogProps, "children">;
  /**
   * The props for the trigger element.
   * @see https://vaul.emilkowal.ski/api#trigger
   * */
  TriggerProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Drawer.Trigger>,
    "children"
  >;
  /**
   * The props for the content element.
   * @see https://vaul.emilkowal.ski/api#content
   * */
  ContentProps?: Omit<ContentProps, "children">;
}> &
  Pick<DialogProps, "direction" | "open" | "onOpenChange" | "defaultOpen">;
