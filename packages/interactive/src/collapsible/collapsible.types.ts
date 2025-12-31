import type { Collapsible } from "@base-ui/react/collapsible";

export type CollapsibleRootProps = Collapsible.Root.Props;
export type CollapsibleTriggerProps = Collapsible.Trigger.Props;
export type CollapsiblePanelProps = Collapsible.Panel.Props & {
  instant?: boolean;
};

export type CollapsibleProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  RootProps?: CollapsibleRootProps;
  TriggerProps?: CollapsibleTriggerProps;
  PanelProps?: CollapsiblePanelProps;
}> &
  Pick<CollapsiblePanelProps, "instant">;
