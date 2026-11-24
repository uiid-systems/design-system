import { definedProps } from "@uiid/utils";

import type { CollapsibleProps } from "./collapsible.types";
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./subcomponents";

export const Collapsible = ({
  trigger,
  instant,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  keepMounted,
  RootProps,
  TriggerProps,
  PanelProps,
  children,
}: CollapsibleProps) => {
  return (
    <CollapsibleRoot
      {...RootProps}
      {...definedProps({ open, defaultOpen, onOpenChange, disabled })}
    >
      <CollapsibleTrigger {...TriggerProps}>{trigger}</CollapsibleTrigger>

      <CollapsiblePanel
        {...PanelProps}
        {...definedProps({ keepMounted })}
        // A bare panel is instant; the monolithic component animates unless
        // told otherwise.
        instant={instant ?? false}
      >
        {children}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Collapsible.displayName = "Collapsible";
