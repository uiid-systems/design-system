"use client";

import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Group, Stack } from "@uiid/layout";

import type { CheckboxGroupRootProps } from "../checkbox-group.types";

import fieldStyles from "../../field/field.module.css";

export const CheckboxGroupRoot = ({
  orientation = "vertical",
  fullwidth,
  gap = 2,
  children,
  ...props
}: CheckboxGroupRootProps) => {
  const isHorizontal = orientation === "horizontal";

  /*
   * `fullwidth` stretches the root. A vertical group's rows stretch across it
   * at any width, as a Stack's do by default; a horizontal one shares the
   * width evenly between its rows. The horizontal half cannot use `Group`'s
   * `evenly` — see `.field-rows-evenly`. A `bordered` frame belongs to the row,
   * so it follows the row out to the edge.
   */
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group-root"
      render={
        isHorizontal ? (
          <Group
            gap={gap}
            fullwidth={fullwidth}
            className={fullwidth ? fieldStyles["field-rows-evenly"] : undefined}
          />
        ) : (
          <Stack gap={gap} fullwidth={fullwidth} />
        )
      }
      {...props}
    >
      {children}
    </BaseCheckboxGroup>
  );
};
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";
