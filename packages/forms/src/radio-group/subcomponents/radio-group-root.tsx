"use client";

import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Group, Stack } from "@uiid/layout";

import type { RadioGroupRootProps } from "../radio-group.types";

import fieldStyles from "../../field/field.module.css";

export const RadioGroupRoot = ({
  orientation = "vertical",
  fullwidth,
  children,
  ...props
}: RadioGroupRootProps) => {
  const isHorizontal = orientation === "horizontal";

  /*
   * `fullwidth` stretches the root, then fills that width along the rows' own
   * axis: a vertical group stretches each row across it, a horizontal one
   * shares it evenly between them. The horizontal half cannot use `Group`'s
   * `evenly` — see `.field-rows-evenly`. A `bordered` frame belongs to the row,
   * so it follows the row out to the edge.
   */
  return (
    <BaseRadioGroup
      data-slot="radio-group-root"
      render={
        isHorizontal ? (
          <Group
            gap={2}
            fullwidth={fullwidth}
            className={fullwidth ? fieldStyles["field-rows-evenly"] : undefined}
          />
        ) : (
          <Stack
            gap={2}
            ax={fullwidth ? "stretch" : undefined}
            fullwidth={fullwidth}
          />
        )
      }
      {...props}
    >
      {children}
    </BaseRadioGroup>
  );
};
RadioGroupRoot.displayName = "RadioGroupRoot";
