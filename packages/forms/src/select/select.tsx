import { Field } from "../field/field";

import { SELECT_DEFAULT_SIZE } from "./select.constants";
import type { SelectProps } from "./select.types";

import {
  SelectRoot,
  SelectTrigger,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
} from "./subcomponents";

export const Select = ({
  size = SELECT_DEFAULT_SIZE,
  label,
  description,
  defaultValue,
  placeholder,
  items,
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  children,
  ...props
}: SelectProps) => {
  return (
    <Field label={label} description={description}>
      <SelectRoot
        defaultValue={defaultValue ?? placeholder ?? items?.[0]?.value}
        {...RootProps}
      >
        <SelectTrigger size={size} {...props} {...TriggerProps} />

        <SelectPortal {...PortalProps}>
          {/* <BaseSelect.Backdrop data-slot="select-backdrop" /> */}

          <SelectPositioner {...PositionerProps}>
            <SelectPopup {...PopupProps}>
              <SelectList {...ListProps}>
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
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </SelectRoot>
    </Field>
  );
};
Select.displayName = "Select";
