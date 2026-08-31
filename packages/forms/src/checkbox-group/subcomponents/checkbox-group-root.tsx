"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Group, Stack } from "@uiid/layout";

import type { CheckboxGroupRootProps } from "../checkbox-group.types";

export const CheckboxGroupRoot = ({
  direction = "vertical",
  children,
  ...props
}: CheckboxGroupRootProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group-root"
      render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
      {...props}
    >
      {children}
    </BaseCheckboxGroup>
  );
};
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";
