"use client";

import { Combobox as BaseInputGroup } from "@base-ui/react/combobox";
import type { Combobox as BaseInputGroupTypes } from "@base-ui/react/combobox";
import { Group } from "@uiid/layout";
import type { GroupProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

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
  className,
  children,
  ...props
}: WithSlot<BaseInputGroupTypes.InputGroup.Props>) => {
  return (
    <BaseInputGroup.InputGroup
      data-slot={slot}
      className={cx(styles["input-group-root"], className)}
      {...props}
    >
      {children}
    </BaseInputGroup.InputGroup>
  );
};
InputGroupRoot.displayName = "InputGroupRoot";

/** The absolutely-positioned strip the Trigger and Clear buttons sit in. */
export const InputGroupActions = ({
  slot,
  className,
  children,
  ...props
}: WithSlot<Omit<GroupProps, "children"> & { children?: React.ReactNode }>) => {
  return (
    <Group
      data-slot={slot}
      className={cx(styles["input-group-actions"], className)}
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
