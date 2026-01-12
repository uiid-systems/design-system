import type { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";

export type TooltipProviderProps = BaseTooltip.Provider.Props;
export type TooltipRootProps = BaseTooltip.Root.Props;
export type TooltipTriggerProps = BaseTooltip.Trigger.Props;
export type TooltipPortalProps = BaseTooltip.Portal.Props;
export type TooltipPositionerProps = BaseTooltip.Positioner.Props;
export type TooltipPopupProps = BaseTooltip.Popup.Props;

export type TooltipProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  ProviderProps?: TooltipProviderProps;
  RootProps?: TooltipRootProps;
  TriggerProps?: TooltipTriggerProps;
  PortalProps?: TooltipPortalProps;
  PositionerProps?: TooltipPositionerProps;
  PopupProps?: TooltipPopupProps;
}> &
  Pick<TooltipRootProps, "open" | "onOpenChange"> &
  Pick<TooltipProviderProps, "delay">;
