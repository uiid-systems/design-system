import type { CollapsibleProps } from "./collapsible.types";

import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./subcomponents";

export const Collapsible = ({
  trigger,
  instant = false,
  RootProps,
  TriggerProps,
  PanelProps,
  children,
}: CollapsibleProps) => {
  return (
    <CollapsibleRoot {...RootProps}>
      <CollapsibleTrigger {...TriggerProps}>{trigger}</CollapsibleTrigger>

      <CollapsiblePanel instant={instant} {...PanelProps}>
        {children}
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
};
Collapsible.displayName = "Collapsible";
