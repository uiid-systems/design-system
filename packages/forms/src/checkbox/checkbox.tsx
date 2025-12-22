import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";

import { CheckIcon, MinusIcon } from "@uiid/icons";
import { ConditionalRender, Group, Stack, SwitchRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { FieldLabel, FieldDescription } from "../field/subcomponents";

import { CHECKBOX_DEFAULT_SIZE } from "./checkbox.constants";
import type { CheckboxProps } from "./checkbox.types";
import styles from "./checkbox.module.css";
import radioStyles from "../radio/radio.module.css";

export const Checkbox = ({
  label,
  description,
  size = CHECKBOX_DEFAULT_SIZE,
  reversed,
  bordered,
  indeterminate,
  ContainerProps,
  IndicatorProps,
  ...props
}: CheckboxProps) => {
  const hasLabel = Boolean(label);
  const hasDescription = Boolean(description);
  const needsTextContainer = hasLabel && hasDescription;

  return (
    <ConditionalRender
      condition={hasLabel}
      render={
        <Group
          render={<label />}
          ay={needsTextContainer ? "start" : "center"}
          gap={3}
          data-reversed={reversed}
          data-bordered={bordered}
          className={radioStyles["label"]}
          {...ContainerProps}
        />
      }
    >
      <BaseCheckbox.Root
        aria-label="Enable notifications"
        className={cx(styles["checkbox"], props.className)}
        data-size={size}
        {...props}
      >
        <BaseCheckbox.Indicator
          className={cx(styles["indicator"], IndicatorProps?.className)}
          {...IndicatorProps}
        >
          <SwitchRender
            condition={Boolean(indeterminate)}
            className={styles["icon"]}
            render={{
              true: <MinusIcon strokeWidth={3} />,
              false: <CheckIcon strokeWidth={3} />,
            }}
          />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>

      <ConditionalRender
        condition={Boolean(description)}
        render={<Stack gap={3} />}
      >
        {label && (
          <FieldLabel level={0} bold={false}>
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
      </ConditionalRender>
    </ConditionalRender>
  );
};
Checkbox.displayName = "Checkbox";
