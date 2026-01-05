import { ConditionalRender, Group, Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import {
  FieldRoot,
  FieldLabel,
  FieldDescription,
} from "../../field/subcomponents";
import { checkboxVariants } from "../../checkbox/checkbox.variants";

import type { SwitchFieldProps } from "../switch.types";
import styles from "../switch.module.css";

export const SwitchField = ({
  label,
  description,
  reversed,
  bordered,
  LabelProps,
  DescriptionProps,
  className,
  children,
  ...props
}: SwitchFieldProps) => {
  const hasLabel = Boolean(label);
  const hasDescription = Boolean(description);
  const needsTextContainer = hasLabel && hasDescription;

  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Group
          render={<label />}
          className={cx(
            styles["switch-label"],
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
SwitchField.displayName = "SwitchField";
