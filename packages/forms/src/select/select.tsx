import { Select as BaseSelect } from "@base-ui-components/react/select";

import { Field } from "../field/field";

import { List } from "@uiid/layout";

import { SELECT_DEFAULT_SIZE } from "./select.constants";
import type { SelectProps } from "./select.types";

import { SelectTrigger, SelectPopup, SelectItem } from "./subcomponents";

export const Select = ({
  size = SELECT_DEFAULT_SIZE,
  label,
  description,
  error,
  defaultValue,
  items,
  TriggerProps,
  PopupProps,
  children,
  ...props
}: SelectProps) => {
  return (
    <Field label={label} description={description} error={error}>
      <BaseSelect.Root
        data-slot="select"
        defaultValue={defaultValue ?? items?.[0]?.value}
        items={items}
        {...props}
      >
        <SelectTrigger size={size} {...TriggerProps} />

        <BaseSelect.Portal>
          {/* <BaseSelect.Backdrop data-slot="select-backdrop" /> */}

          <BaseSelect.Positioner data-slot="select-positioner" sideOffset={4}>
            <BaseSelect.ScrollUpArrow data-slot="select-scroll-up-arrow" />

            <SelectPopup {...PopupProps}>
              <BaseSelect.List data-slot="select-list" render={<List />}>
                {!items
                  ? children
                  : items.map(
                      ({ label, value, disabled, description, icon }) => (
                        <SelectItem
                          key={value}
                          label={label}
                          value={value}
                          disabled={disabled}
                          description={description}
                          icon={icon}
                        />
                      ),
                    )}
              </BaseSelect.List>
            </SelectPopup>

            <BaseSelect.ScrollDownArrow />
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </Field>
  );
};
Select.displayName = "Select";
