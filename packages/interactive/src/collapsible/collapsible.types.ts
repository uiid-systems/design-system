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
};

export type CollapsibleProps = React.PropsWithChildren<{
  trigger: CollapsibleTriggerProps["children"];
  RootProps?: CollapsibleRootProps;
  TriggerProps?: CollapsibleTriggerProps;
  PanelProps?: CollapsiblePanelProps;
}> &
  Pick<CollapsiblePanelProps, "instant">;
