import type { Popover } from "@base-ui-components/react/popover";

import type { CardProps } from "@uiid/cards";

export type PopoverProps = React.PropsWithChildren<{
  /** A render prop for the trigger element. */
  trigger: React.ReactNode;
  /**
   * The props for the root element.
   * @see https://base-ui-components.github.io/react/popover/#root
   */
  RootProps?: Popover.Root.Props;
  /**
   * The props for the trigger element.
   * @see https://base-ui-components.github.io/react/popover/#trigger
   */
  TriggerProps?: Omit<Popover.Trigger.Props, "children">;
  /**
   * The props for the positioner element.
   * @see https://base-ui-components.github.io/react/popover/#positioner
   */
  PositionerProps?: Popover.Positioner.Props;
  /**
   * The props for the popup element.
   * @see https://base-ui-components.github.io/react/popover/#popup
   */
  PopupProps?: Omit<Popover.Popup.Props, "children">;
}> &
  Pick<
    CardProps,
    | "title"
    | "onDismiss"
    | "primaryAction"
    | "secondaryAction"
    | "tertiaryAction"
  >;
