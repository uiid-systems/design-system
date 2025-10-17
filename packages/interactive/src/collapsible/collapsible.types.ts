import type { Collapsible } from "@base-ui-components/react/collapsible";

export type CollapsibleProps = React.PropsWithChildren<{
  trigger: React.ReactNode;
  RootProps?: Collapsible.Root.Props;
  TriggerProps?: Collapsible.Trigger.Props;
  PanelProps?: Collapsible.Panel.Props;
  instant?: boolean;
}>;
