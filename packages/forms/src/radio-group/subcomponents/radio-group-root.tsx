"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";

import { fieldRowsRender } from "../../field/subcomponents/field-rows-render";
import type { RadioGroupRootProps } from "../radio-group.types";

export const RadioGroupRoot = ({
  orientation = "vertical",
  w,
  gap = 2,
  children,
  ...props
}: RadioGroupRootProps) => {
  return (
    <BaseRadioGroup
      data-slot="radio-group-root"
      render={fieldRowsRender({ orientation, w, gap })}
      {...props}
    >
      {children}
    </BaseRadioGroup>
  );
};
RadioGroupRoot.displayName = "RadioGroupRoot";
