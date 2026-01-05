import { ConditionalRender } from "@uiid/layout";

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
  SelectValue,
  SelectIndicator,
} from "./subcomponents";

export const Select = ({
  size = SELECT_DEFAULT_SIZE,
  fullwidth,
  ghost,
  disabled,
  required,
  label,
  description,
  placeholder,
  items,
  defaultValue,
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps,
  PopupProps,
  ListProps,
  ValueProps,
  IndicatorProps,
  FieldProps,
  children,
  ...props
}: SelectProps) => {
  return (
    <ConditionalRender
      condition={Boolean(label || description)}
      render={
        <Field
          label={label}
          description={description}
          required={required}
          {...FieldProps}
        />
      }
    >
      <SelectRoot
        defaultValue={defaultValue ?? placeholder ?? items?.[0]?.value}
        items={items}
        {...props}
        {...RootProps}
      >
        <SelectTrigger
          fullwidth={fullwidth}
          ghost={ghost}
          disabled={disabled}
          {...TriggerProps}
        >
          <SelectValue size={size} {...ValueProps} />
          <SelectIndicator {...IndicatorProps} />
        </SelectTrigger>
        <SelectPortal {...PortalProps}>
          {/* <BaseSelect.Backdrop data-slot="select-backdrop" /> */}

          <SelectPositioner {...PositionerProps}>
            <SelectPopup {...PopupProps}>
              <SelectList {...ListProps}>
                {!items
                  ? children
                  : items.map(
                      ({
                        label,
                        value,
                        disabled: itemDisabled,
                        description,
                        icon,
                      }) => (
                        <SelectItem
                          key={value}
                          label={label}
                          value={value}
                          disabled={itemDisabled || disabled}
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
    </ConditionalRender>
  );
};
Select.displayName = "Select";
