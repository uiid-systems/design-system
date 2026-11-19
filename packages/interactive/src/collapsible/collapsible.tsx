import { definedProps } from "@uiid/utils";

import type { CollapsibleProps } from "./collapsible.types";
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./subcomponents";

export const Collapsible = ({
  trigger,
  instant = false,
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
        instant={instant}
        {...PanelProps}
        {...definedProps({ keepMounted })}
      >
        {children}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Collapsible.displayName = "Collapsible";
