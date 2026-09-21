"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { resolveTrigger } from "@uiid/utils";

import type { CollapsibleTriggerProps } from "../collapsible.types";

export const CollapsibleTrigger = ({
  children,
  ...props
}: CollapsibleTriggerProps) => (
  <BaseCollapsible.Trigger
    data-slot="collapsible-trigger"
    {...resolveTrigger(children, props.render)}
    {...props}
  />
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";
