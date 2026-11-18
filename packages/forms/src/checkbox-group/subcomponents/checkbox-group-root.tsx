"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import { fieldRowsRender } from "../../field/subcomponents/field-rows-render";
import type { CheckboxGroupRootProps } from "../checkbox-group.types";

export const CheckboxGroupRoot = ({
  orientation = "vertical",
  fullwidth,
  gap = 2,
  children,
  ...props
}: CheckboxGroupRootProps) => {
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group-root"
      render={fieldRowsRender({ orientation, fullwidth, gap })}
      {...props}
    >
      {children}
    </BaseCheckboxGroup>
  );
};
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";
