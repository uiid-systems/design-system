"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Group, Stack } from "@uiid/layout";

import type { RadioGroupRootProps } from "../radio-group.types";

export const RadioGroupRoot = ({
  direction = "vertical",
  children,
  ...props
}: RadioGroupRootProps) => {
  const isHorizontal = direction === "horizontal";

  return (
    <BaseRadioGroup
      data-slot="radio-group-root"
      render={isHorizontal ? <Group gap={2} /> : <Stack gap={2} />}
      {...props}
    >
      {children}
    </BaseRadioGroup>
  );
};
RadioGroupRoot.displayName = "RadioGroupRoot";
