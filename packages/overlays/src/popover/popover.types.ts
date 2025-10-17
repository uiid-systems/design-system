import type { Popover } from "@base-ui-components/react/popover";

export type PopoverProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  title: string;
  description: string;

  RootProps?: Popover.Root.Props;
  TriggerProps?: Omit<Popover.Trigger.Props, "children">;
  BackdropProps?: Popover.Backdrop.Props;
  PortalProps?: Popover.Portal.Props;
  PositionerProps?: Popover.Positioner.Props;
  PopupProps?: Omit<Popover.Popup.Props, "children">;
  TitleProps?: Omit<Popover.Title.Props, "children">;
  DescriptionProps?: Omit<Popover.Description.Props, "children">;
  CloseProps?: Popover.Close.Props;
}>;
