"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";

import { Stack } from "@uiid/layout";

import type { CollapsibleRootProps } from "../collapsible.types";

export const CollapsibleRoot = ({
  children,
  ...props
}: CollapsibleRootProps) => {
  return (
    <BaseCollapsible.Root
      data-slot="collapsible-root"
      render={<Stack />}
      {...props}
    >
      {children}
    </BaseCollapsible.Root>
  );
};
CollapsibleRoot.displayName = "CollapsibleRoot";
