"use client";

import { Combobox as BaseInputGroup } from "@base-ui/react/combobox";
import type { Combobox as BaseInputGroupTypes } from "@base-ui/react/combobox";
import { Group } from "@uiid/layout";
import type { GroupProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { InputVariants } from "../../input/input.types";
import { inputGroupVariants } from "./input-group.variants";

import styles from "./input-group.module.css";

/**
 * The input-side parts Combobox and Autocomplete share: the group that wraps
 * the input with its controls, plus the Trigger, Clear and Icon buttons.
 *
 * As with the popup layer, Base UI ships one implementation for both
 * namespaces — `Autocomplete.InputGroup` *is* `Combobox.InputGroup` — so this
 * module is a neutral home rather than either component reaching into its
 * sibling. Each component keeps its own wrapper names and `data-slot` values.
 */

type WithSlot<T> = T & {
  /** The consuming component's `data-slot` value. */
  slot: string;
};

export const InputGroupRoot = ({
  slot,
  size,
  className,
  children,
  ...props
}: WithSlot<BaseInputGroupTypes.InputGroup.Props> &
  Pick<InputVariants, "size">) => {
  return (
    <BaseInputGroup.InputGroup
      data-slot={slot}
      className={cx(
        styles["input-group-root"],
        inputGroupVariants({ size }),
        className,
      )}
      {...props}
    >
      {children}
    </BaseInputGroup.InputGroup>
  );
};
InputGroupRoot.displayName = "InputGroupRoot";

/**
 * The row the Trigger and Clear buttons sit in. It is handed to the input
 * wrapper's `after` slot, so it takes its edge and its icon sizing from the
 * field slot like any other slotted content — rather than the absolutely
 * positioned overlay it used to be, which paid for its own layout space with a
 * fixed 4rem inset on the input that held across every tier.
 */
export const InputGroupActions = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<Omit<GroupProps, "children"> & { children?: React.ReactNode }>) => {
  return (
    <Group
      data-slot={slot}
      className={className}
      ay="center"
      ax="center"
      gap={2}
      {...props}
    >
      {children}
    </Group>
  );
};
InputGroupActions.displayName = "InputGroupActions";

export const InputGroupTrigger = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<BaseInputGroupTypes.Trigger.Props>) => {
  return (
    <BaseInputGroup.Trigger
      data-slot={slot}
      /*
       * Base UI labels the trigger with the field's label, which is right when
       * the trigger *is* the control. Here it sits in the trailing slot of an
       * input that already carries that label, so leaving it on gave two
       * elements the same accessible name — and, since `aria-labelledby`
       * outranks `aria-label`, silently shadowed the trigger's own name.
       */
      aria-labelledby={undefined}
      className={cx(styles["input-group-action"], className)}
      {...props}
    >
      {children}
    </BaseInputGroup.Trigger>
  );
};
InputGroupTrigger.displayName = "InputGroupTrigger";

export const InputGroupClear = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<BaseInputGroupTypes.Clear.Props>) => {
  return (
    <BaseInputGroup.Clear
      data-slot={slot}
      className={cx(styles["input-group-action"], className)}
      {...props}
    >
      {children}
    </BaseInputGroup.Clear>
  );
};
InputGroupClear.displayName = "InputGroupClear";

export const InputGroupIcon = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<BaseInputGroupTypes.Icon.Props>) => {
  return (
    <BaseInputGroup.Icon data-slot={slot} className={className} {...props}>
      {children}
    </BaseInputGroup.Icon>
  );
};
InputGroupIcon.displayName = "InputGroupIcon";
