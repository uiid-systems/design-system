import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { isValidElement } from "react";

import type { CollapsibleTriggerProps } from "../collapsible.types";

export const CollapsibleTrigger = ({
  children,
  ...props
}: CollapsibleTriggerProps) => {
  const triggerIsEl = isValidElement(children);

  return (
    <BaseCollapsible.Trigger
      data-slot="collapsible-trigger"
      nativeButton={triggerIsEl}
      render={
        triggerIsEl ? (
          children
        ) : (
          <span role="button" tabIndex={0}>
            {children}
          </span>
        )
      }
      {...props}
    >
      {children}
    </BaseCollapsible.Trigger>
  );
};
CollapsibleTrigger.displayName = "CollapsibleTrigger";
