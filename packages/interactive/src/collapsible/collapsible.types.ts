import type { Collapsible } from "@base-ui/react/collapsible";
import type { StackProps } from "@uiid/layout";
import type {
  WithLayoutProps,
  WithStringClassName,
  WithTriggerChildren,
} from "@uiid/utils";

export type CollapsibleRootProps = WithLayoutProps<
  Collapsible.Root.Props,
  StackProps
>;
export type CollapsibleTriggerProps = WithTriggerChildren<
  Collapsible.Trigger.Props,
  Collapsible.Trigger.State
>;
export type CollapsiblePanelProps = WithLayoutProps<
  WithStringClassName<Collapsible.Panel.Props>,
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
  /** Everything else on the root. The state props and `children` are set on Collapsible itself. */
  RootProps?: Omit<
    CollapsibleRootProps,
    "open" | "defaultOpen" | "onOpenChange" | "disabled" | "children"
  >;
  /** Reaches the trigger. Its content is `trigger`. */
  TriggerProps?: Omit<CollapsibleTriggerProps, "children">;
  /** Reaches the panel. `instant`, `keepMounted` and `children` are set on Collapsible itself. */
  PanelProps?: Omit<
    CollapsiblePanelProps,
    "instant" | "keepMounted" | "children"
  >;
}> &
  Pick<
    Collapsible.Root.Props,
    "open" | "defaultOpen" | "onOpenChange" | "disabled"
  > &
  Pick<CollapsiblePanelProps, "instant" | "keepMounted">;
