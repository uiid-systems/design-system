import type { Tooltip } from "@base-ui-components/react/tooltip";
import type { TooltipTriggerProps } from "./subcomponents/tooltip-trigger";

export type TooltipProps = React.PropsWithChildren<{
  RootProps?: Tooltip.Root.Props;
  PortalProps?: Tooltip.Portal.Props;
  PositionerProps?: Tooltip.Positioner.Props;
  PopupProps?: Omit<Tooltip.Popup.Props, "children">;
}> &
  TooltipTriggerProps;
