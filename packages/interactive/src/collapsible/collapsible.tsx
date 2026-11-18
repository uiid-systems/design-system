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
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      {...RootProps}
    >
      <CollapsibleTrigger {...TriggerProps}>{trigger}</CollapsibleTrigger>

      <CollapsiblePanel
        instant={instant}
        keepMounted={keepMounted}
        {...PanelProps}
      >
        {children}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Collapsible.displayName = "Collapsible";
