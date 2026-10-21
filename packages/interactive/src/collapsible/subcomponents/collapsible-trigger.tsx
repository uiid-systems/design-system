"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { resolveTrigger } from "@uiid/utils";

import type { CollapsibleTriggerProps } from "../collapsible.types";

export const CollapsibleTrigger = ({
  children,
  render,
  nativeButton,
  ...props
}: CollapsibleTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BaseCollapsible.Trigger
      data-slot="collapsible-trigger"
      {...props}
      render={render ?? resolved.render}
      nativeButton={nativeButton ?? resolved.nativeButton}
    >
      {resolved.children}
    </BaseCollapsible.Trigger>
  );
};
CollapsibleTrigger.displayName = "CollapsibleTrigger";
