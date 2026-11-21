import type { Collapsible } from "@base-ui/react/collapsible";
import type { StackProps } from "@uiid/layout";
import type { WithLayoutProps, WithTriggerChildren } from "@uiid/utils";

export type CollapsibleRootProps = WithLayoutProps<
  Collapsible.Root.Props,
  StackProps
>;
export type CollapsibleTriggerProps = WithTriggerChildren<
  Collapsible.Trigger.Props,
  Collapsible.Trigger.State
>;
export type CollapsiblePanelProps = WithLayoutProps<
  Collapsible.Panel.Props,
  StackProps
> & {
  instant?: boolean;
  /**
   * The axis the panel opens along. `"vertical"` (the default) animates its
   * height; `"horizontal"` animates its width, for a panel that opens sideways.
   */
  orientation?: "vertical" | "horizontal";
};

export type CollapsibleProps = React.PropsWithChildren<{
  trigger: CollapsibleTriggerProps["children"];
  /** Everything else on the root. A top-level prop wins over the same key here. */
  RootProps?: CollapsibleRootProps;
  TriggerProps?: CollapsibleTriggerProps;
  PanelProps?: CollapsiblePanelProps;
}> &
  Pick<
    Collapsible.Root.Props,
    "open" | "defaultOpen" | "onOpenChange" | "disabled"
  > &
  Pick<CollapsiblePanelProps, "instant" | "keepMounted">;
