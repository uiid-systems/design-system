import type { Collapsible } from "@base-ui/react/collapsible";
import type { StackProps } from "@uiid/layout";
import type { WithLayoutProps } from "@uiid/utils";

export type CollapsibleRootProps = WithLayoutProps<
  Collapsible.Root.Props,
  StackProps
>;
export type CollapsibleTriggerProps = Omit<
  Collapsible.Trigger.Props,
  "children"
> & {
  /**
   * An element is used as the trigger itself. A string, or a function of the
   * trigger's state, is content: it renders inside a focusable
   * `role="button"` span, and a function re-renders as the state changes.
   */
  children?:
    | React.ReactNode
    | ((state: Collapsible.Trigger.State) => React.ReactNode);
};
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
