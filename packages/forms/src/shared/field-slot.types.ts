import type { FieldProps } from "../field/field.types";

/**
 * Keys every control sets on its Field: the chrome it renders from its own
 * `label`, `description` and `action`, and the control itself as `children`.
 */
type FieldChromeKeys = "label" | "description" | "action" | "children";

/**
 * The `FieldProps` slot of a form control: Field's props without the keys the
 * control already sets on Field from its own top-level props. `Owned` names
 * the keys beyond the chrome, such as `name`, `required`, `disabled` and
 * `size`, so passing one through the slot is a compile error rather than a
 * silent conflict with the top-level value. `ActionProps` loses `children`
 * for the same reason: Field would render it in place of the control's
 * `action`.
 */
export type FieldSlotProps<Owned extends keyof FieldProps = never> = Omit<
  FieldProps,
  FieldChromeKeys | Owned | "ActionProps"
> & {
  ActionProps?: Omit<NonNullable<FieldProps["ActionProps"]>, "children">;
};
