"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import { fieldRowsRender } from "../../field/subcomponents/field-rows-render";
import type { CheckboxGroupRootProps } from "../checkbox-group.types";

export const CheckboxGroupRoot = ({
  orientation = "vertical",
  w,
  gap = 2,
  children,
  ...props
}: CheckboxGroupRootProps) => {
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group-root"
      render={fieldRowsRender({ orientation, w, gap })}
      {...props}
    >
      {children}
    </BaseCheckboxGroup>
  );
};
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";
