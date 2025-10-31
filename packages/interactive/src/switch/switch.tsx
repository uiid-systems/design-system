import { Switch as BaseSwitch } from "@base-ui-components/react/switch";

import { FormFieldLabel } from "@uiid/forms";
import { ConditionalRender, Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { SwitchProps } from "./switch.types";
import styles from "./switch.module.css";

export const Switch = ({
  RootProps,
  ThumbProps,
  label,
  labelPosition = "after",
  name,
  disabled,
}: SwitchProps) => {
  const propsWithId = { uiid: "switch", ...RootProps };

  const hasLabel = Boolean(label);
  const hasLabelBefore = hasLabel && labelPosition === "before";
  const hasLabelAfter = hasLabel && labelPosition === "after";

  const SwitchLabel = () => (
    <FormFieldLabel
      data-slot="switch-label"
      data-disabled={disabled}
      htmlFor={name}
    >
      {label}
    </FormFieldLabel>
  );

  return (
    <ConditionalRender
      condition={hasLabel}
      render={<Group gap={2} ay="center" />}
    >
      {hasLabelBefore && <SwitchLabel />}
      <BaseSwitch.Root
        id={name}
        name={name}
        disabled={disabled}
        className={cx(styles["switch-root"], RootProps?.className)}
        {...propsWithId}
      >
        <BaseSwitch.Thumb
          className={cx(styles["switch-thumb"], ThumbProps?.className)}
          {...ThumbProps}
        />
      </BaseSwitch.Root>
      {hasLabelAfter && <SwitchLabel />}
    </ConditionalRender>
  );
};
Switch.displayName = "Switch";
