import { ConditionalRender, Group, Stack, type GroupProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { FieldLabel, FieldDescription } from "../../field/subcomponents";

import type { CheckboxProps } from "../checkbox.types";
import styles from "../checkbox.module.css";

export type CheckboxFieldProps = React.PropsWithChildren &
  Pick<CheckboxProps, "label" | "description" | "reversed" | "bordered"> &
  GroupProps;

export const CheckboxField = ({
  label,
  description,
  reversed,
  bordered,
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
          ay={needsTextContainer ? "start" : "center"}
          gap={3}
          data-reversed={reversed}
          data-bordered={bordered}
          className={cx(styles["label"], className)}
          {...props}
        />
      }
    >
      {children}

      <ConditionalRender
        condition={Boolean(description)}
        render={<Stack gap={3} />}
      >
        {label && (
          <FieldLabel render={<span />} level={0} bold={false}>
            {label}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
      </ConditionalRender>
    </ConditionalRender>
  );
};
CheckboxField.displayName = "CheckboxField";
