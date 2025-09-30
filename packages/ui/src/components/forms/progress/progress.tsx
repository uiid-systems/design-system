import { cx } from "@uiid/primitives";

import { FormField } from "../formfield";

import type { ProgressProps } from "./progress.types";
import styles from "./progress.module.css";

export const Progress = ({
  value = 0,
  max = 100,
  name,
  label,
  description,
  required,
  ...props
}: ProgressProps) => {
  const propsWithId = { uiid: "progress", ...props };

  return (
    <FormField
      name={name}
      label={label}
      description={description}
      required={required}
    >
      <progress
        {...propsWithId}
        value={value}
        max={max}
        className={cx(styles.progress, props.className)}
      />
    </FormField>
  );
};
Progress.displayName = "Progress";
