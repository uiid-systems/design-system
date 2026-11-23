import type { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { WithStringClassName, WithTriggerChildren } from "@uiid/utils";

export type TooltipProviderProps = BaseTooltip.Provider.Props;
export type TooltipRootProps = BaseTooltip.Root.Props;
export type TooltipTriggerProps = WithTriggerChildren<
  WithStringClassName<BaseTooltip.Trigger.Props>,
  BaseTooltip.Trigger.State
>;
export type TooltipPortalProps = BaseTooltip.Portal.Props;
export type TooltipPositionerProps =
  WithStringClassName<BaseTooltip.Positioner.Props>;
export type TooltipPopupProps = WithStringClassName<BaseTooltip.Popup.Props>;

export type TooltipProps = React.PropsWithChildren<{
  trigger: TooltipTriggerProps["children"];
  /** Applied only when the Tooltip mounts its own provider, outside any `TooltipProvider`. */
  ProviderProps?: TooltipProviderProps;
  RootProps?: TooltipRootProps;
  TriggerProps?: TooltipTriggerProps;
  PortalProps?: TooltipPortalProps;
  PositionerProps?: TooltipPositionerProps;
  PopupProps?: TooltipPopupProps;
}> &
  Pick<TooltipRootProps, "open" | "defaultOpen" | "onOpenChange"> &
  Pick<TooltipTriggerProps, "delay">;
