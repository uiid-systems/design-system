"use client";

import { ConditionalRender, Group } from "@uiid/layout";

import type { SwitchProps } from "./switch.types";

import { SwitchRoot, SwitchThumb, SwitchLabel } from "./subcomponents";

export const Switch = ({
  RootProps,
  ThumbProps,
  label,
  labelPosition = "after",
  name,
  disabled,
}: SwitchProps) => {
  const hasLabel = Boolean(label);
  const hasLabelBefore = hasLabel && labelPosition === "before";
  const hasLabelAfter = hasLabel && labelPosition === "after";

  return (
    <ConditionalRender
      condition={hasLabel}
      render={<Group gap={2} ay="center" />}
    >
      {hasLabelBefore && (
        <SwitchLabel disabled={disabled} name={name} label={label} />
      )}
      <SwitchRoot id={name} name={name} disabled={disabled} {...RootProps}>
        <SwitchThumb {...ThumbProps} />
      </SwitchRoot>
      {hasLabelAfter && (
        <SwitchLabel disabled={disabled} name={name} label={label} />
      )}
    </ConditionalRender>
  );
};
Switch.displayName = "Switch";
