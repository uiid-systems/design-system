import { NumberField as BaseNumberField } from "@base-ui-components/react/number-field";

import { PlusIcon, MinusIcon } from "@uiid/icons";
import { Stack, Group } from "@uiid/layout";

import { Input } from "../input/input";

import type { NumberFieldProps } from "./number-field.types";
import styles from "./number-field.module.css";

export const NumberField = ({ ...props }: NumberFieldProps) => {
  return (
    <BaseNumberField.Root
      defaultValue={100}
      render={<Stack gap={2} />}
      className={styles["number-field"]}
      {...props}
    >
      {/* <BaseNumberField.ScrubArea className={styles.ScrubArea}>
        <BaseNumberField.ScrubAreaCursor className={styles.ScrubAreaCursor}>
          TKTKTK
        </BaseNumberField.ScrubAreaCursor>
      </BaseNumberField.ScrubArea> */}

      <BaseNumberField.Group render={<Group ay="stretch" />}>
        <BaseNumberField.Decrement className={styles["decrement"]}>
          <MinusIcon />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          render={<Input />}
          className={styles["number-input"]}
        />
        <BaseNumberField.Increment className={styles["increment"]}>
          <PlusIcon />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
};
NumberField.displayName = "NumberField";
