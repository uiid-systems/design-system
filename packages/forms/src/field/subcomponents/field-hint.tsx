"use client";

import { Tooltip } from "@uiid/overlays";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { FIELD_TOOLTIP_DELAY } from "../field.constants";
import type {
  FieldHint as FieldHintValue,
  FieldHintProps,
} from "../field.types";
import styles from "../field.module.css";

export const FieldHint = ({
  icon: Icon,
  text,
  tooltip,
  className,
  ...props
}: FieldHintValue & FieldHintProps) => {
  if (tooltip && Icon) {
    return (
      <span
        data-slot="field-hint"
        className={cx(styles["field-hint"], className)}
        {...props}
      >
        <Tooltip
          trigger={<Icon />}
          delay={FIELD_TOOLTIP_DELAY}
          TriggerProps={{ render: <span /> }}
          PositionerProps={{ align: "end" }}
        >
          {tooltip}
        </Tooltip>
        {text && <Text size={-1}>{text}</Text>}
      </span>
    );
  }

  return (
    <span
      data-slot="field-hint"
      className={cx(styles["field-hint"], className)}
      {...props}
    >
      {Icon && <Icon />}
      {text && <Text size={-1}>{text}</Text>}
    </span>
  );
};
FieldHint.displayName = "FieldHint";
