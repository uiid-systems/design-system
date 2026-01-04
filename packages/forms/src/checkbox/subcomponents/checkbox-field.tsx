import { ConditionalRender, Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
} from "../../field/subcomponents";

import type { CheckboxFieldProps } from "../checkbox.types";
import { checkboxVariants } from "../checkbox.variants";
import styles from "../checkbox.module.css";

export const CheckboxField = ({
  label,
  description,
  reversed,
  bordered,
  LabelProps,
  DescriptionProps,
  className,
  children,
  ...props
}: CheckboxFieldProps) => {
  const hasLabel = Boolean(label);
  const hasDescription = Boolean(description);
  const needsTextContainer = hasLabel && hasDescription;

  return (
    <ConditionalRender
      condition={hasLabel}
      render={
        <Group
          render={<label />}
          className={cx(
            styles["checkbox-label"],
            checkboxVariants({ reversed, bordered }),
            className,
          )}
          ay={needsTextContainer ? "start" : "center"}
          gap={3}
          {...props}
        />
      }
    >
      {children}
      {Boolean(label || description) && (
        <FieldRoot>
          <ConditionalRender
            condition={Boolean(label && description)}
            render={<Stack gap={3} />}
          >
            {label && (
              <FieldLabel weight="normal" {...LabelProps}>
                {label}
              </FieldLabel>
            )}
            {description && (
              <FieldDescription {...DescriptionProps}>
                {description}
              </FieldDescription>
            )}
          </ConditionalRender>
        </FieldRoot>
      )}
    </ConditionalRender>
  );
};
CheckboxField.displayName = "CheckboxField";
