import { Radio as BaseRadio } from "@base-ui-components/react/radio";

import { ConditionalRender, Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { FieldLabel, FieldDescription } from "../field/subcomponents";

import type { RadioProps } from "./radio.types";
import styles from "./radio.module.css";

export const Radio = ({
  value,
  label,
  description,
  reversed,
  bordered,
  hideIndicator,
  IndicatorProps,
  ContainerProps,
  LabelProps,
  DescriptionProps,
  className,
  ...props
}: RadioProps) => {
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
          className={styles["label"]}
          {...ContainerProps}
        />
      }
    >
      <BaseRadio.Root
        {...props}
        value={value}
        render={<Group uiid="radio" ax="center" ay="center" p={0} m={0} />}
        className={cx(styles["radio"], className, {
          "sr-only": hideIndicator,
        })}
      >
        <BaseRadio.Indicator
          {...IndicatorProps}
          render={<Group ax="center" ay="center" />}
          className={cx(styles["indicator"], IndicatorProps?.className)}
        />
      </BaseRadio.Root>

      <ConditionalRender
        condition={needsTextContainer}
        render={<Stack gap={3} />}
      >
        {label && (
          <FieldLabel render={<span />} bold={false} level={0} {...LabelProps}>
            {label}
          </FieldLabel>
        )}
        {description && (
          <FieldDescription {...DescriptionProps}>
            {description}
          </FieldDescription>
        )}
      </ConditionalRender>
    </ConditionalRender>
  );
};
Radio.displayName = "Radio";
