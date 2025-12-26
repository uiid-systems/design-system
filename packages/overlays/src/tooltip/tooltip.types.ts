import type { Tooltip } from "@base-ui/react/tooltip";

export type TooltipProps = React.PropsWithChildren<{
  /** A render prop for the trigger element. */
  trigger: React.ReactNode;
  /**
   * The props for the root element.
   * @see https://base-ui-components.github.io/react/tooltip/#root
   */
  RootProps?: Tooltip.Root.Props;
  /**
   * The props for the trigger element.
   * @see https://base-ui-components.github.io/react/tooltip/#trigger
   */
  TriggerProps?: Tooltip.Trigger.Props;
  /**
   * The props for the positioner element.
   * @see https://base-ui-components.github.io/react/tooltip/#positioner
   */
  PositionerProps?: Tooltip.Positioner.Props;
  /**
   * The props for the popup element.
   * @see https://base-ui-components.github.io/react/tooltip/#popup
   */
  PopupProps?: Omit<Tooltip.Popup.Props, "children">;
}>;
